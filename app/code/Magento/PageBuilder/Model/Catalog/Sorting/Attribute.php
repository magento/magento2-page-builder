<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting;

use Magento\Framework\DB\Select;

/**
 * Class for sorting by specified attribute
 */
class Attribute implements SortInterface
{
    /**
     * @var string
     */
    private $label;

    /**
     * @var string
     */
    private $sort_direction;

    /**
     * @var string
     */
    private $attribute_field;

    /**
     * @param string $label
     * @param string $sort_direction
     * @param string $attribute_field
     */
    public function __construct(
        string $label,
        string $sort_direction,
        string $attribute_field
    ) {
        $this->label = $label;
        $this->sort_direction = $sort_direction;
        $this->attribute_field = $attribute_field;
    }

    /**
     * @inheritdoc
     */
    public function sort(
        \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
    ): \Magento\Catalog\Model\ResourceModel\Product\Collection {
        $collection->getSelect()->reset(Select::ORDER);
        $collection->addOrder($this->attribute_field, $this->sort_direction);
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
