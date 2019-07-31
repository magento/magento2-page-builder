<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\Catalog\Block\Product;

use Magento\PageBuilder\Model\Catalog\Sorting;

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
     * ProductsListPlugin constructor.
     *
     * @param Sorting $sorting
     */
    public function __construct(
        Sorting $sorting
    ) {
        $this->sorting = $sorting;
    }

    /**
     * Allow to sort product collection
     *
     * @param \Magento\CatalogWidget\Block\Product\ProductsList $subject
     * @param \Magento\Catalog\Model\ResourceModel\Product\Collection $result
     * @return \Magento\Catalog\Model\ResourceModel\Product\Collection
     */
    public function afterCreateCollection(
        \Magento\CatalogWidget\Block\Product\ProductsList $subject,
        \Magento\Catalog\Model\ResourceModel\Product\Collection $result
    ) {

        $sortOption = $subject->getData('sort_order');
        if (isset($sortOption)) {
            $sortedResult = $this->sorting->applySorting($sortOption, $result);

            return $sortedResult;
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
}
