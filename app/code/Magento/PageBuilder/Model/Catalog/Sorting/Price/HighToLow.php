<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog\Sorting\Price;

use \Magento\PageBuilder\Model\Catalog\Sorting\PriceAbstract;

/**
 * Class Price\HighToLow
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting\Price
 */
class HighToLow extends PriceAbstract
{
    /**
     * @inheritdoc
     */
    protected function getSortDirection()
    {
        return $this->descOrder();
    }

    /**
     * @inheritdoc
     */
    public function getLabel(): string
    {
        return __('Price: high to low');
    }
}
