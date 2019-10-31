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
    private $secondarySortDirection;

    /**
     * @var string
     */
    private $attributeField;

    /**
     * @param string $label
     * @param string|null $sortDirection
     * @param string|null $attributeField
     * @param string|null $secondarySortDirection
     */
    public function __construct(
        string $label,
        string $sortDirection = null,
        string $attributeField = null,
        string $secondarySortDirection = null
    ) {
        $this->label = $label;
        $this->sortDirection = $sortDirection;
        $this->attributeField = $attributeField;
        $this->secondarySortDirection = $secondarySortDirection ?? $sortDirection;
    }

    /**
     * @inheritdoc
     */
    public function sort(
        \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
    ): \Magento\Catalog\Model\ResourceModel\Product\Collection {
        if ($this->attributeField && $this->sortDirection) {
            $collection->getSelect()->reset(Select::ORDER);
            $collection->addAttributeToSort($this->attributeField, $this->sortDirection);
            $collection->addAttributeToSort('entity_id', $this->secondarySortDirection);
        }
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
