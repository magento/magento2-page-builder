<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting;

use Magento\Framework\DB;

/**
 * Class for sorting by stock
 */
class Stock implements SortInterface
{
    /**
     * @var string
     */
    private $label;

    /**
     * @var string
     */
    private $sortDirection;

    /**
     * @var \Magento\Framework\Module\ModuleManagerInterface
     */
    private $moduleManager;

    /**
     * @param string $label
     * @param string $sortDirection
     * @param \Magento\Framework\Module\ModuleManagerInterface $moduleManager
     */
    public function __construct(
        string $label,
        string $sortDirection,
        \Magento\Framework\Module\ModuleManagerInterface $moduleManager
    ) {
        $this->label = $label;
        $this->sortDirection = $sortDirection;
        $this->moduleManager = $moduleManager;
    }

    /**
     * @inheritdoc
     */
    public function sort(
        \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
    ): \Magento\Catalog\Model\ResourceModel\Product\Collection {
        if (!$this->moduleManager->isEnabled('Magento_CatalogInventory')) {
            return $collection;
        }

        $baseSetIds = $collection->getAllIds();
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
            ->order('final_qty '.$this->sortDirection);

        $resultIds = [];

        $collection->load();

        foreach ($collection as $item) {
            $resultIds[] = $item->getId();
        }

        $ids = array_unique(array_merge($resultIds, $baseSetIds));

        $finalSet->getSelect()
            ->reset(DB\Select::ORDER)
            ->reset(DB\Select::WHERE);

        $finalSet->addAttributeToFilter('entity_id', ['in' => $ids]);
        if (count($ids)) {
            $finalSet->getSelect()->order(new \Zend_Db_Expr('FIELD(e.entity_id, ' . implode(',', $ids). ')'));
        }

        return $finalSet;
    }

    /**
     * @inheritdoc
     */
    public function getLabel(): \Magento\Framework\Phrase
    {
        return __($this->label);
    }
}
