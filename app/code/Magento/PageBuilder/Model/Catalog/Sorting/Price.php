<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting;

use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Framework\DB\Select;
use Magento\Framework\Phrase;

/**
 * Sort catalog products by price
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
     * @var string
     */
    private $secondarySortDirection;

    /**
     * @param string $label
     * @param string $sortDirection
     * @param string $secondarySortDirection
     */
    public function __construct(
        string $label,
        string $sortDirection = Select::SQL_ASC,
        ?string $secondarySortDirection = null
    ) {
        $this->label = $label;
        $this->sortDirection = $sortDirection;
        $this->secondarySortDirection = $secondarySortDirection ?? $sortDirection;
    }

    /**
     * @inheritDoc
     */
    public function sort(Collection $collection): Collection
    {
        $collection->getSelect()->reset(Select::ORDER);
        if ($collection->getLimitationFilters()->isUsingPriceIndex()) {
            $collection->getSelect()->order("price_index.min_price $this->sortDirection");
        } else {
            $collection->addAttributeToSort('price', $this->sortDirection);
        }
        $collection->addAttributeToSort('entity_id', $this->secondarySortDirection);
        return $collection;
    }

    /**
     * @inheritdoc
     */
    public function getLabel(): Phrase
    {
        return __($this->label);
    }
}
