<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting\Category;

use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Framework\DB\Select;
use Magento\Framework\Phrase;
use Magento\PageBuilder\Model\Catalog\Sorting\OptionInterface;
use Magento\Store\Model\Store;

/**
 * Sort catalog products by their positions in the category
 */
class Position implements OptionInterface
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
     * @param string|null $secondarySortDirection
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
        $filters = $collection->getLimitationFilters();
        if ($collection->getStoreId() === Store::DEFAULT_STORE_ID && isset($filters['category_id'])) {
            $collection->getSelect()->order("cat_index_position $this->sortDirection");
        } else {
            $collection->addAttributeToSort('position', $this->sortDirection);
        }
        if ($this->secondarySortDirection) {
            $collection->addAttributeToSort('entity_id', $this->secondarySortDirection);
        }
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
