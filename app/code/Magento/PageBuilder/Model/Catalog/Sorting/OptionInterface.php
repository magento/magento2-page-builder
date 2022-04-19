<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting;

/**
 * Interface OptionInterface
 *
 * @api
 */
interface OptionInterface
{
    /**
     * Sort products in product widget collection according to specified option.
     *
     * @param \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
     * @return \Magento\Catalog\Model\ResourceModel\Product\Collection
     */
    public function sort(
        \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
    ): \Magento\Catalog\Model\ResourceModel\Product\Collection;

    /**
     * Sorting option short description
     *
     * @return \Magento\Framework\Phrase
     */
    public function getLabel(): \Magento\Framework\Phrase;
}
