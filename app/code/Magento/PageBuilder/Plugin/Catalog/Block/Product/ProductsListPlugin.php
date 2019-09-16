<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\Catalog\Block\Product;

use Magento\PageBuilder\Model\Catalog\Sorting;
use Magento\Catalog\Model\Category;
use Magento\CatalogInventory\Helper\Stock;
use Magento\Catalog\Api\CategoryRepositoryInterface;

/**
 * Catalog Products List widget block plugin
 */
class ProductsListPlugin
{
    /**
     * @var Sorting
     */
    private $sorting;

    /**
     * @var Stock
     */
    private $stock;

    /**
     * @var CategoryRepositoryInterface
     */
    private $categoryRepository;

    /**
     * @param Sorting $sorting
     * @param Stock $stock
     * @param CategoryRepositoryInterface $categoryRepository
     */
    public function __construct(
        Sorting $sorting,
        Stock $stock,
        CategoryRepositoryInterface $categoryRepository
    ) {
        $this->sorting = $sorting;
        $this->stock = $stock;
        $this->categoryRepository = $categoryRepository;
    }

    /**
     * Allow to sort product collection
     *
     * @param \Magento\CatalogWidget\Block\Product\ProductsList $subject
     * @param \Magento\Catalog\Model\ResourceModel\Product\Collection $result
     * @return \Magento\Catalog\Model\ResourceModel\Product\Collection
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function afterCreateCollection(
        \Magento\CatalogWidget\Block\Product\ProductsList $subject,
        \Magento\Catalog\Model\ResourceModel\Product\Collection $result
    ) {
        $categoryId = $subject->getData('category_ids');
        $sortOption = $subject->getData('sort_order');

        $this->stock->addIsInStockFilterToCollection($result);

        if (!empty($categoryId)) {
            $result->addCategoryFilter($this->categoryRepository->get($categoryId));
        }

        if (!empty($sortOption)) {
            return $this->sorting->applySorting($sortOption, $result);
        } else {
            return $result;
        }
    }

    /**
     * Include sort order in cache key
     *
     * @param \Magento\CatalogWidget\Block\Product\ProductsList $subject
     * @param array $cacheKeys
     * @return array
     */
    public function afterGetCacheKeyInfo(\Magento\CatalogWidget\Block\Product\ProductsList $subject, array $cacheKeys)
    {
        $cacheKeys[] = $subject->getData('sort_order');
        return $cacheKeys;
    }

    /**
     * Add category cache identifier
     *
     * @param \Magento\CatalogWidget\Block\Product\ProductsList $subject
     * @param array $result
     * @return array
     */
    public function afterGetIdentities(\Magento\CatalogWidget\Block\Product\ProductsList $subject, array $result)
    {
        $categoryId = $subject->getData('category_ids');
        $sortOption = $subject->getData('sort_order');

        if (!empty($categoryId) && $sortOption === 'position') {
            $result[] = Category::CACHE_TAG . '_' . $categoryId;
        }
        return $result;
    }
}
