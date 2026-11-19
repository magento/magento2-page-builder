<?php
/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block\Catalog\Product;

use Magento\Catalog\Block\Product\Context;
use Magento\Catalog\Model\Category;
use Magento\Catalog\Model\Product\Visibility;
use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Catalog\Model\ResourceModel\Product\CollectionFactory;
use Magento\CatalogWidget\Block\Product\ProductsList;
use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Catalog\ViewModel\Product\OptionsData;
use Magento\CatalogWidget\Model\Rule;
use Magento\CatalogWidget\Model\Rule\Condition\Product\CategoryConditionProcessor;
use Magento\Framework\App\Http\Context as HttpContext;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\Url\EncoderInterface;
use Magento\Framework\View\LayoutFactory;
use Magento\PageBuilder\Model\Catalog\CategoryListing\CollectionBuilder;
use Magento\Rule\Model\Condition\Sql\Builder as SqlBuilder;
use Magento\Widget\Helper\Conditions;

/**
 * Renders the products of a category the way the category page lists them
 *
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class CategoryListing extends ProductsList
{
    /**
     * @var CollectionBuilder
     */
    private $collectionBuilder;

    /**
     * @var Collection|null
     */
    private $builtCollection;

    /**
     * @param Context $context
     * @param CollectionFactory $productCollectionFactory
     * @param Visibility $catalogProductVisibility
     * @param HttpContext $httpContext
     * @param SqlBuilder $sqlBuilder
     * @param Rule $rule
     * @param Conditions $conditionsHelper
     * @param CollectionBuilder $collectionBuilder
     * @param array $data
     * @param Json|null $json
     * @param LayoutFactory|null $layoutFactory
     * @param EncoderInterface|null $urlEncoder
     * @param CategoryRepositoryInterface|null $categoryRepository
     * @param OptionsData|null $optionsData
     * @param CategoryConditionProcessor|null $categoryConditionProcessor
     *
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        Context $context,
        CollectionFactory $productCollectionFactory,
        Visibility $catalogProductVisibility,
        HttpContext $httpContext,
        SqlBuilder $sqlBuilder,
        Rule $rule,
        Conditions $conditionsHelper,
        CollectionBuilder $collectionBuilder,
        array $data = [],
        ?Json $json = null,
        ?LayoutFactory $layoutFactory = null,
        ?EncoderInterface $urlEncoder = null,
        ?CategoryRepositoryInterface $categoryRepository = null,
        ?OptionsData $optionsData = null,
        ?CategoryConditionProcessor $categoryConditionProcessor = null
    ) {
        $this->collectionBuilder = $collectionBuilder;

        parent::__construct(
            $context,
            $productCollectionFactory,
            $catalogProductVisibility,
            $httpContext,
            $sqlBuilder,
            $rule,
            $conditionsHelper,
            $data,
            $json,
            $layoutFactory,
            $urlEncoder,
            $categoryRepository,
            $optionsData,
            $categoryConditionProcessor
        );
    }

    /**
     * @inheritdoc
     */
    public function createCollection()
    {
        return $this->getBaseCollection();
    }

    /**
     * @inheritdoc
     */
    public function getBaseCollection(): Collection
    {
        if ($this->builtCollection === null) {
            $sortOrder = $this->getData('sort_order');

            $this->builtCollection = $this->collectionBuilder->build(
                $this->resolveCategoryId(),
                $sortOrder === null ? null : (string)$sortOrder,
                (int)$this->getProductsCount(),
                $this->getStoreId(),
                $this
            );
        }

        return $this->builtCollection;
    }

    /**
     * @inheritdoc
     */
    public function getCacheKeyInfo()
    {
        $cacheKeyInfo = parent::getCacheKeyInfo();
        $cacheKeyInfo[] = $this->resolveCategoryId();
        $cacheKeyInfo[] = $this->getData('sort_order');

        return $cacheKeyInfo;
    }

    /**
     * @inheritdoc
     */
    public function getIdentities()
    {
        $identities = parent::getIdentities();
        $categoryId = $this->resolveCategoryId();

        if ($categoryId > 0) {
            $identities[] = Category::CACHE_TAG . '_' . $categoryId;
        }

        return $identities;
    }

    /**
     * Category to list, from the Page Builder parameter or from the widget chooser value
     *
     * @return int
     */
    private function resolveCategoryId(): int
    {
        $categoryId = $this->getData('category_id');

        if (!empty($categoryId)) {
            return (int)$categoryId;
        }

        $idPath = explode('/', (string)$this->getData('id_path'));

        return isset($idPath[1]) ? (int)$idPath[1] : 0;
    }

    /**
     * Store the collection has to be built for
     *
     * @return int|null
     */
    private function getStoreId(): ?int
    {
        $storeId = $this->getData('store_id');

        return $storeId === null ? null : (int)$storeId;
    }
}
