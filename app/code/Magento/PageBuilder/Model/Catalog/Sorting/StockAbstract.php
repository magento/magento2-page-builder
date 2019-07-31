<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting;

use Magento\Framework\DB;

/**
 * Class StockAbstract
 */
abstract class StockAbstract extends SortAbstract implements SortInterface
{
    /**
     * @var \Magento\Framework\Module\ModuleManagerInterface
     */
    private $moduleManager;

    /**
     * @param \Magento\Framework\Module\ModuleManagerInterface $moduleManager
     */
    public function __construct(
        \Magento\Framework\Module\ModuleManagerInterface $moduleManager
    ) {
        $this->moduleManager = $moduleManager;
    }

    /**
     * @inheritdoc
     */
    abstract protected function getSortDirection(): string;

    /**
     * @inheritdoc
     */
    public function sort(
        \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
    ): \Magento\Catalog\Model\ResourceModel\Product\Collection {
        if (!$this->moduleManager->isEnabled('Magento_CatalogInventory')) {
            return $collection;
        }

        $baseSet = clone $collection;
        $finalSet = clone $collection;
        $collection->setCurPage(0);

        $collection->joinField(
            'child_id',
            'catalog_product_relation',
            'child_id',
            'parent_id=entity_id',
            null,
            'left'
        );

        $collection->joinField(
            'qty',
            'cataloginventory_stock_item',
            'qty',
            'product_id=entity_id',
            ['stock_id' => \Magento\CatalogInventory\Model\Stock::DEFAULT_STOCK_ID],
            'left'
        );

        $collection->joinField(
            'parent_qty',
            'cataloginventory_stock_item',
            'qty',
            'product_id=child_id',
            ['stock_id' => \Magento\CatalogInventory\Model\Stock::DEFAULT_STOCK_ID],
            'left'
        );

        $collection->getSelect()
            ->columns(
                [
                    'final_qty' => new DB\Sql\ColumnValueExpression(
                        'IF(SUM(`at_parent_qty`.`qty`), SUM(`at_parent_qty`.`qty`), SUM(`at_qty`.`qty`))'
                    )
                ]
            )
            ->group('entity_id')
            ->having('final_qty > 0')
            ->reset(DB\Select::ORDER)
            ->order('final_qty '.$this->getSortDirection());

        $resultIds = [];

        $collection->load();

        foreach ($collection as $item) {
            $resultIds[] = $item->getId();
        }

        $ids = array_unique(array_merge($resultIds, $baseSet->getAllIds()));

        $finalSet->getSelect()
            ->reset(DB\Select::ORDER)
            ->reset(DB\Select::WHERE);

        $finalSet->addAttributeToFilter('entity_id', ['in' => $ids]);
        if (count($ids)) {
            $finalSet->getSelect()->order(new \Zend_Db_Expr('FIELD(e.entity_id, ' . implode(',', $ids). ')'));
        }

        return $finalSet;
    }
}
