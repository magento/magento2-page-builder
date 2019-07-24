<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog\Sorting\Stock;

/**
 * Class Stock\Descending
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting\Stock
 */
class Descending extends \Magento\PageBuilder\Model\Catalog\Sorting\StockAbstract
{
    /**
     * @inheritdoc
     */
    protected function getSortDirection(): string
    {
        return $this->descOrder();
    }

    /**
     * @inheritdoc
     */
    public function getLabel(): string
    {
        return __('Stock: high stock first');
    }
}
