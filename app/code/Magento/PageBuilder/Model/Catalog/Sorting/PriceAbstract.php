<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog\Sorting;

use \Magento\Framework\DB\Select;

/**
 * Class PriceAbstract
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting
 */
abstract class PriceAbstract extends SortAbstract implements SortInterface
{
    /**
     * @inheritdoc
     */
    abstract protected function getSortDirection();

    /**
     * @inheritdoc
     */
    public function sort(
        \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
    ): \Magento\Catalog\Model\ResourceModel\Product\Collection {
        $collection->joinAttribute('price', 'catalog_product/price', 'entity_id', null, 'left');
        $collection->getSelect()
            ->reset(Select::ORDER)
            ->order('price '.$this->getSortDirection());

        return $collection;
    }
}
