<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog\Sorting\Price;

use \Magento\PageBuilder\Model\Catalog\Sorting\PriceAbstract;

/**
 * Class Price\LowToHigh
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting\Price
 */
class LowToHigh extends PriceAbstract
{
    /**
     * @inheritdoc
     */
    protected function getSortDirection()
    {
        return $this->ascOrder();
    }

    /**
     * @inheritdoc
     */
    public function getLabel(): string
    {
        return __('Price: Low to high');
    }
}
