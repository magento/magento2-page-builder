<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting;

use Magento\Framework\DB\Select;

/**
 * Class PriceAbstract
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
        $collection->joinAttribute('sorting_price', 'catalog_product/price', 'entity_id', null, 'left');
        $collection->getSelect()
            ->reset(Select::ORDER)
            ->order('sorting_price '.$this->getSortDirection());

        return $collection;
    }
}
