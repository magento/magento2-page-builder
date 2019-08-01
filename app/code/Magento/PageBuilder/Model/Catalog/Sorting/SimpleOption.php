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
class SimpleOption implements OptionInterface
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
     * @var string
     */
    private $attribute_field;

    /**
     * @param string $label
     * @param string $sortDirection
     * @param string $attribute_field
     */
    public function __construct(
        string $label,
        string $sortDirection,
        string $attribute_field
    ) {
        $this->label = $label;
        $this->sortDirection = $sortDirection;
        $this->attribute_field = $attribute_field;
    }

    /**
     * @inheritdoc
     */
    public function sort(
        \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
    ): \Magento\Catalog\Model\ResourceModel\Product\Collection {
        $collection->getSelect()->reset(Select::ORDER);
        $collection->addOrder($this->attribute_field, $this->sortDirection);
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
