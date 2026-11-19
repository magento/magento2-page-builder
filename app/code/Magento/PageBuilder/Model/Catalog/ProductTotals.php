<?php
/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog;

use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Catalog\Model\Product\Attribute\Source\Status;
use Magento\Catalog\Model\Product\Visibility;
use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Catalog\Model\ResourceModel\Product\CollectionFactory;
use Magento\CatalogWidget\Model\Rule;
use Magento\CatalogWidget\Model\Rule\Condition\Product\CategoryConditionProcessor;
use Magento\Framework\App\Area;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\App\ResourceConnection;
use Magento\Framework\EntityManager\MetadataPool;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\PageBuilder\Model\Catalog\CategoryListing\CollectionBuilder;
use Magento\Rule\Model\Condition\Combine;
use Magento\Rule\Model\Condition\Sql\Builder;
use Magento\Store\Model\App\Emulation;
use Magento\Store\Model\Store;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Widget\Helper\Conditions;
use Zend_Db_Select_Exception;

/**
 * Product totals for Products content type
 *
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class ProductTotals
{
    public const CONDITION_OPTION_CATEGORY_LISTING = 'category_listing';

    /**
     * @var CollectionFactory
     */
    private $productCollectionFactory;

    /**
     * @var Builder
     */
    private $sqlBuilder;

    /**
     * @var Rule
     */
    private $rule;

    /**
     * @var Conditions
     */
    private $conditionsHelper;

    /**
     * @var CategoryRepositoryInterface
     */
    private $categoryRepository;

    /**
     * @var MetadataPool
     */
    private MetadataPool $metadataPool;

    /**
     * @var ResourceConnection
     */
    private ResourceConnection $resource;

    /**
     * @var CategoryConditionProcessor
     */
    private CategoryConditionProcessor $categoryConditionProcessor;

    /**
     * @var CollectionBuilder
     */
    private CollectionBuilder $categoryListingCollectionBuilder;

    /**
     * @var Emulation
     */
    private Emulation $emulation;

    /**
     * @var StoreManagerInterface
     */
    private StoreManagerInterface $storeManager;

    /**
     * @param CollectionFactory $productCollectionFactory
     * @param Builder $sqlBuilder
     * @param Rule $rule
     * @param Conditions $conditionsHelper
     * @param CategoryRepositoryInterface $categoryRepository
     * @param MetadataPool|null $metadataPool
     * @param ResourceConnection|null $resource
     * @param CategoryConditionProcessor|null $categoryConditionProcessor
     * @param CollectionBuilder|null $categoryListingCollectionBuilder
     * @param Emulation|null $emulation
     * @param StoreManagerInterface|null $storeManager
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        CollectionFactory $productCollectionFactory,
        Builder $sqlBuilder,
        Rule $rule,
        Conditions $conditionsHelper,
        CategoryRepositoryInterface $categoryRepository,
        ?MetadataPool $metadataPool = null,
        ?ResourceConnection $resource = null,
        ?CategoryConditionProcessor $categoryConditionProcessor = null,
        ?CollectionBuilder $categoryListingCollectionBuilder = null,
        ?Emulation $emulation = null,
        ?StoreManagerInterface $storeManager = null
    ) {
        $this->productCollectionFactory = $productCollectionFactory;
        $this->sqlBuilder = $sqlBuilder;
        $this->rule = $rule;
        $this->conditionsHelper = $conditionsHelper;
        $this->categoryRepository = $categoryRepository;
        $this->metadataPool = $metadataPool ?: ObjectManager::getInstance()->get(MetadataPool::class);
        $this->resource = $resource ?: ObjectManager::getInstance()->get(ResourceConnection::class);
        $this->categoryConditionProcessor = $categoryConditionProcessor ?: ObjectManager::getInstance()
            ->get(CategoryConditionProcessor::class);
        $this->categoryListingCollectionBuilder = $categoryListingCollectionBuilder ?: ObjectManager::getInstance()
            ->get(CollectionBuilder::class);
        $this->emulation = $emulation ?: ObjectManager::getInstance()->get(Emulation::class);
        $this->storeManager = $storeManager ?: ObjectManager::getInstance()->get(StoreManagerInterface::class);
    }

    /**
     * Decode the provided conditions
     *
     * @param string $conditions
     * @return Combine
     */
    private function decodeConditions(string $conditions): Combine
    {
        if ($conditions) {
            $conditions = $this->conditionsHelper->decode($conditions);
        }

        foreach ($conditions as $key => $condition) {
            if (!empty($condition['attribute'])) {
                if (in_array($condition['attribute'], ['special_from_date', 'special_to_date'])) {
                    $conditions[$key]['value'] = date('Y-m-d H:i:s', strtotime($condition['value']));
                }

                if ($condition['attribute'] == 'category_ids') {
                    $conditions[$key] = $this->categoryConditionProcessor->process($condition);
                }
            }
        }

        $this->rule->loadPost(['conditions' => $conditions]);
        return $this->rule->getConditions();
    }

    /**
     * Retrieve product collection based on provided conditions
     *
     * @param string $conditions
     * @param bool $usePriceIndex use minimal price from price index to filter by price.
     * If TRUE only enabled products will be returned, as price indexer does not include disabled products
     * @return Collection
     * @throws LocalizedException
     */
    private function getProductCollection(string $conditions, bool $usePriceIndex = true): Collection
    {
        /** @var $collection Collection */
        $collection = $this->productCollectionFactory->create();
        if ($usePriceIndex && strpos($conditions, '"attribute":"price"') !== false) {
            $collection->addMinimalPrice();
        }

        $collection = $this->applyConditionsToCollection($conditions, $collection);
        $collection = $this->excludeLinkedProducts($collection);

        /**
         * Prevent retrieval of duplicate records. This may occur when multiselect product attribute matches
         * several allowed values from condition simultaneously
         */
        $collection->distinct(true);

        return $collection;
    }

    /**
     * Get parent products that don't have stand-alone properties (e.g. price or special price)
     *
     * @param Collection $collection
     * @return Collection|null
     * @throws \Exception
     */
    private function getParentProductsCollection(Collection $collection): ?Collection
    {
        $parentProducts = $this->productCollectionFactory->create();
        $linkField = $this->metadataPool->getMetadata(\Magento\Catalog\Api\Data\ProductInterface::class)
            ->getLinkField();
        $connection = $this->resource->getConnection();
        $productIds = $connection->fetchCol(
            $connection
                ->select()
                ->from(['e' => $collection->getTable('catalog_product_entity')], ['link_table.parent_id'])
                ->joinInner(
                    ['link_table' => $collection->getTable('catalog_product_super_link')],
                    'link_table.product_id = e.' . $linkField,
                    []
                )
                ->where('link_table.product_id IN (?)', $collection->getAllIds())
        );
        if ($productIds) {
            $parentProducts->addIdFilter($productIds);
            return $parentProducts;
        }

        return null;
    }

    /**
     * Retrieve count of all enabled products
     *
     * @param string $conditions
     * @return int number of enabled products
     * @throws LocalizedException
     * @throws \Exception
     */
    private function getEnabledCount(string $conditions): int
    {
        $collection = $this->getProductCollection($conditions, true);
        $collection->addAttributeToFilter('status', Status::STATUS_ENABLED);
        $count = $collection->getSize();
        if ($collection->getSize() && $parentProducts = $this->getParentProductsCollection($collection)) {
            $parentProducts->addAttributeToFilter('status', Status::STATUS_ENABLED);
            $count += $parentProducts->getSize();
        }

        return $count;
    }

    /**
     * Retrieve count of all disabled products
     *
     * @param string $conditions
     * @return int number of disabled products
     * @throws \Exception
     */
    private function getDisabledCount(string $conditions): int
    {
        $collection = $this->getProductCollection($conditions, false);
        $collection->addAttributeToFilter('status', Status::STATUS_DISABLED);
        $count = $collection->getSize();
        if ($count && $parentProducts = $this->getParentProductsCollection($collection)) {
            $parentProducts->addAttributeToFilter('status', Status::STATUS_DISABLED);
            $count += $parentProducts->getSize();
        }

        return $count;
    }

    /**
     * Retrieve count of all not visible individually products
     *
     * @param string $conditions
     * @return int number of products not visible individually
     * @throws \Exception
     */
    private function getNotVisibleCount(string $conditions): int
    {
        $collection = $this->getProductCollection($conditions, true);
        $collection->addAttributeToFilter('status', Status::STATUS_ENABLED);
        $collection->addAttributeToFilter(
            'visibility',
            [
                Visibility::VISIBILITY_NOT_VISIBLE,
                Visibility::VISIBILITY_IN_SEARCH
            ]
        );
        $count = $collection->getSize();
        if ($count && $parentProducts = $this->getParentProductsCollection($collection)) {
            $parentProducts->addAttributeToFilter('status', Status::STATUS_ENABLED);
            $parentProducts->addAttributeToFilter(
                'visibility',
                [
                    Visibility::VISIBILITY_NOT_VISIBLE,
                    Visibility::VISIBILITY_IN_SEARCH
                ]
            );
            $count += $parentProducts->getSize();
        }

        return $count;
    }

    /**
     * Exclude any linked products, e.g. simple products assigned to a configurable, bundle or group
     *
     * @param Collection $collection
     * @return Collection
     */
    private function excludeLinkedProducts(Collection $collection): Collection
    {
        $collection->getSelect()
            ->joinLeft(
                ['super_link_table' => $collection->getTable('catalog_product_super_link')],
                'super_link_table.product_id = e.entity_id',
                ['product_id']
            )
            ->joinLeft(
                ['link_table' => $collection->getTable('catalog_product_link')],
                'link_table.product_id = e.entity_id',
                ['product_id']
            )
            ->where('link_table.product_id IS NULL OR super_link_table.product_id IS NULL');
        return $collection;
    }

    /**
     * Apply conditions to collection
     *
     * @param string $conditions
     * @param Collection $collection
     * @return Collection
     * @throws LocalizedException
     */
    private function applyConditionsToCollection(string $conditions, Collection $collection): Collection
    {
        /** @var Combine $collectionConditions */
        $collectionConditions = $this->decodeConditions($conditions);
        $collectionConditions->collectValidatedAttributes($collection);
        $this->sqlBuilder->attachConditionToCollection($collection, $collectionConditions);
        return $collection;
    }

    /**
     * Retrieve product totals for collection
     *
     * @param string $conditions
     * @param string|null $conditionOption
     * @param int|null $categoryId
     * @return array
     * @throws LocalizedException
     * @throws Zend_Db_Select_Exception
     */
    public function getProductTotals(
        string $conditions,
        ?string $conditionOption = null,
        ?int $categoryId = null
    ): array {
        if ($conditionOption === self::CONDITION_OPTION_CATEGORY_LISTING) {
            return $this->getCategoryListingTotals((int)$categoryId);
        }

        $enabledCount = $this->getEnabledCount($conditions);
        $disabledCount = $this->getDisabledCount($conditions);
        $notVisibleCount = $this->getNotVisibleCount($conditions);

        return [
            'total' => $enabledCount + $disabledCount,
            'disabled' => $disabledCount,
            'notVisible' => $notVisibleCount,
        ];
    }

    /**
     * Retrieve totals for the category listing option, counted through the storefront catalog layer
     *
     * @param int $categoryId
     * @return array
     * @throws \Exception
     */
    private function getCategoryListingTotals(int $categoryId): array
    {
        $storeId = $this->getStorefrontStoreId();
        $this->emulation->startEnvironmentEmulation($storeId, Area::AREA_FRONTEND, true);

        try {
            $total = $this->categoryListingCollectionBuilder
                ->build($categoryId, null, null, $storeId)
                ->getSize();
        } finally {
            $this->emulation->stopEnvironmentEmulation();
        }

        return [
            'total' => $total,
            'disabled' => 0,
            'notVisible' => 0,
        ];
    }

    /**
     * Resolve a store view to build the storefront collection for
     *
     * @return int
     * @throws NoSuchEntityException
     */
    private function getStorefrontStoreId(): int
    {
        $store = $this->storeManager->getStore();

        if ((int)$store->getId() === Store::DEFAULT_STORE_ID) {
            $store = $this->storeManager->getDefaultStoreView();
        }

        return $store === null ? Store::DEFAULT_STORE_ID : (int)$store->getId();
    }
}
