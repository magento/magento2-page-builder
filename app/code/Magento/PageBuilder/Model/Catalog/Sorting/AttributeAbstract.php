<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting;

use Magento\Framework\DB\Select;

/**
 * Class AttributeAbstract
 */
abstract class AttributeAbstract extends SortAbstract implements SortInterface
{
    /**
     * Sort direction
     *
     * @return string
     */
    abstract protected function getSortDirection();

    /**
     * Attribute field
     *
     * @return string
     */
    abstract protected function getSortField();

    /**
     * @inheritdoc
     */
    public function sort(
        \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
    ): \Magento\Catalog\Model\ResourceModel\Product\Collection {
        $collection->getSelect()->reset(Select::ORDER);
        $collection->addOrder($this->getSortField(), $this->getSortDirection());
        return $collection;
    }
}
