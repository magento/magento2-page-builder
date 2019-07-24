<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog\Sorting;

/**
 * Interface SortInterface
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting
 */
interface SortInterface
{
    /**
     * Sort method
     *
     * @param \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
     * @return \Magento\Catalog\Model\ResourceModel\Product\Collection
     */
    public function sort(
        \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
    ): \Magento\Catalog\Model\ResourceModel\Product\Collection;

    /**
     * Sorting label
     *
     * @return string
     */
    public function getLabel(): string;
}
