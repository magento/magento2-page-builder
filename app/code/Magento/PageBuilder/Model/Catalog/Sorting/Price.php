<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting;

use Magento\Framework\DB\Select;

/**
 * Class for sorting by price
 */
class Price implements OptionInterface
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
     * @param string $label
     * @param string $sortDirection
     */
    public function __construct(
        string $label,
        string $sortDirection
    ) {
        $this->label = $label;
        $this->sortDirection = $sortDirection;
    }

    /**
     * @inheritdoc
     */
    public function sort(
        \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
    ): \Magento\Catalog\Model\ResourceModel\Product\Collection {
        $collection->joinAttribute('sorting_price', 'catalog_product/price', 'entity_id', null, 'left');
        $collection->getSelect()
            ->reset(Select::ORDER)
            ->order('sorting_price '.$this->sortDirection)
            ->order('entity_id');

        return $collection;
    }

    /**
     * @inheritdoc
     */
    public function getLabel(): \Magento\Framework\Phrase
    {
        return __($this->label);
    }
}
