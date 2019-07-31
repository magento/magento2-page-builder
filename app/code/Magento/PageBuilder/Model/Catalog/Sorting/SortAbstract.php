<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog\Sorting;

/**
 * Class SortAbstract
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting
 */
class SortAbstract
{
    /**
     * @var \Magento\Framework\Module\Manager
     */
    protected $moduleManager;

    /**
     * SortAbstract constructor.
     *
     * @param \Magento\Framework\Module\Manager $moduleManager
     */
    public function __construct(
        \Magento\Framework\Module\Manager $moduleManager
    ) {
        $this->moduleManager = $moduleManager;
    }

    /**
     * Stock ID
     *
     * @return int
     */
    protected function getStockId(): int
    {
        return \Magento\CatalogInventory\Model\Stock::DEFAULT_STOCK_ID;
    }

    /**
     * Sorting ascending order
     *
     * @return string
     */
    protected function ascOrder(): string
    {
        return \Magento\Framework\DB\Select::SQL_ASC;
    }

    /**
     * Sorting descending order
     *
     * @return string
     */
    protected function descOrder(): string
    {
        return \Magento\Framework\DB\Select::SQL_DESC;
    }
}
