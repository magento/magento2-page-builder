<?php
/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\CategoryListing;

use Magento\Catalog\Model\Category;
use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Catalog\Model\Config;
use Magento\Catalog\Model\Layer\CategoryFactory;
use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Catalog\Model\ResourceModel\Product\CollectionFactory;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Event\ManagerInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\View\Element\AbstractBlock;
use Magento\PageBuilder\Model\Catalog\Sorting;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\StoreManagerInterface;

/**
 * Builds the category listing product collection through the storefront catalog layer
 *
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class CollectionBuilder
{
    public const PREPARE_EVENT = 'pagebuilder_products_category_listing_prepare';

    private const XML_PATH_DEFAULT_SORT_BY = 'catalog/frontend/default_sort_by';

    private const POSITION_ORDER = 'position';

    /**
     * @var CategoryFactory
     */
    private $layerFactory;

    /**
     * @var CategoryRepositoryInterface
     */
    private $categoryRepository;

    /**
     * @var Config
     */
    private $catalogConfig;

    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    /**
     * @var ManagerInterface
     */
    private $eventManager;

    /**
     * @var Sorting
     */
    private $sorting;

    /**
     * @var CollectionFactory
     */
    private $productCollectionFactory;

    /**
     * @param CategoryFactory $layerFactory
     * @param CategoryRepositoryInterface $categoryRepository
     * @param Config $catalogConfig
     * @param ScopeConfigInterface $scopeConfig
     * @param StoreManagerInterface $storeManager
     * @param ManagerInterface $eventManager
     * @param Sorting $sorting
     * @param CollectionFactory $productCollectionFactory
     */
    public function __construct(
        CategoryFactory $layerFactory,
        CategoryRepositoryInterface $categoryRepository,
        Config $catalogConfig,
        ScopeConfigInterface $scopeConfig,
        StoreManagerInterface $storeManager,
        ManagerInterface $eventManager,
        Sorting $sorting,
        CollectionFactory $productCollectionFactory
    ) {
        $this->layerFactory = $layerFactory;
        $this->categoryRepository = $categoryRepository;
        $this->catalogConfig = $catalogConfig;
        $this->scopeConfig = $scopeConfig;
        $this->storeManager = $storeManager;
        $this->eventManager = $eventManager;
        $this->sorting = $sorting;
        $this->productCollectionFactory = $productCollectionFactory;
    }

    /**
     * Build the product collection a category page would render for the given category
     *
     * @param int $categoryId
     * @param string|null $sortOrder
     * @param int|null $pageSize
     * @param int|null $storeId
     * @param AbstractBlock|null $block
     * @return Collection
     * @throws NoSuchEntityException
     */
    public function build(
        int $categoryId,
        ?string $sortOrder = null,
        ?int $pageSize = null,
        ?int $storeId = null,
        ?AbstractBlock $block = null
    ): Collection {
        $storeId = $storeId ?? (int)$this->storeManager->getStore()->getId();
        $category = $this->getCategory($categoryId, $storeId);

        if ($category === null) {
            return $this->productCollectionFactory->create()->addIdFilter([0]);
        }

        $layer = $this->layerFactory->create();

        $this->eventManager->dispatch(
            self::PREPARE_EVENT,
            [
                'category' => $category,
                'layer' => $layer,
                'store_id' => $storeId,
                'block' => $block,
            ]
        );

        $layer->setCurrentCategory($category);

        $collection = $layer->getProductCollection();
        $collection->setStoreId($storeId);
        $collection->addCategoryFilter($category);

        $this->applySorting($collection, $category, $sortOrder, $storeId);

        if ($pageSize !== null) {
            $collection->setPageSize($pageSize)->setCurPage(1);
        }

        return $collection;
    }

    /**
     * Load the requested category, or null when it cannot be listed
     *
     * @param int $categoryId
     * @param int $storeId
     * @return Category|null
     */
    private function getCategory(int $categoryId, int $storeId): ?Category
    {
        if ($categoryId <= 0) {
            return null;
        }

        try {
            $category = $this->categoryRepository->get($categoryId, $storeId);
        } catch (NoSuchEntityException $exception) {
            return null;
        }

        if (!$category instanceof Category || !$category->getIsActive()) {
            return null;
        }

        return $category;
    }

    /**
     * Apply the chosen sorting option, or the sorting the category page would apply
     *
     * @param Collection $collection
     * @param Category $category
     * @param string|null $sortOrder
     * @param int $storeId
     * @return void
     */
    private function applySorting(
        Collection $collection,
        Category $category,
        ?string $sortOrder,
        int $storeId
    ): void {
        if (!empty($sortOrder) && $this->sorting->getSortingInstance($sortOrder) !== null) {
            $this->sorting->applySorting($sortOrder, $collection);
            return;
        }

        $order = $this->resolveCategoryOrder($category, $storeId);

        if ($order === null) {
            return;
        }

        if ($order === self::POSITION_ORDER) {
            $collection->addAttributeToSort(self::POSITION_ORDER, 'asc');
        } else {
            $collection->setOrder($order, 'asc');
        }
    }

    /**
     * Resolve the order field the way Toolbar::getCurrentOrder() does for a category page
     *
     * @param Category $category
     * @param int $storeId
     * @return string|null
     */
    private function resolveCategoryOrder(Category $category, int $storeId): ?string
    {
        $availableOrders = $category->getAvailableSortByOptions();
        if (empty($availableOrders)) {
            $availableOrders = $this->catalogConfig->getAttributeUsedForSortByArray();
        }

        $order = $category->getDefaultSortBy();
        if (empty($order) || !isset($availableOrders[$order])) {
            $order = $this->scopeConfig->getValue(
                self::XML_PATH_DEFAULT_SORT_BY,
                ScopeInterface::SCOPE_STORE,
                $storeId
            );
        }

        if (empty($order) || !isset($availableOrders[$order])) {
            $order = array_key_first($availableOrders);
        }

        return $order === null ? null : (string)$order;
    }
}
