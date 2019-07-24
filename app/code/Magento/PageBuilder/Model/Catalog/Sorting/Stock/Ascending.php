<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog\Sorting\Stock;

/**
 * Class Stock\Ascending
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting\Stock
 */
class Ascending extends \Magento\PageBuilder\Model\Catalog\Sorting\StockAbstract
{
    /**
     * @inheritdoc
     */
    protected function getSortDirection(): string
    {
        return $this->ascOrder();
    }

    /**
     * @inheritdoc
     */
    public function getLabel(): string
    {
        return __('Stock: low stock first');
    }
}
