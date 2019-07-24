<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog\Sorting;

/**
 * Class DefaultSorting
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting
 */
class DefaultSorting extends SortAbstract implements SortInterface
{
    /**
     * @inheritdoc
     */
    public function sort(
        \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
    ): \Magento\Catalog\Model\ResourceModel\Product\Collection {
        return $collection;
    }

    /**
     * @inheritdoc
     */
    public function getLabel(): string
    {
        return __('None');
    }
}
