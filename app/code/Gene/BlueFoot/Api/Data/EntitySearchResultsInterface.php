<?php

namespace Gene\BlueFoot\Api\Data;

use Magento\Framework\Api\SearchResultsInterface;

/**
 * Interface EntitySearchResultsInterface
 *
 * @package Gene\BlueFoot\Api\Data
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
interface EntitySearchResultsInterface extends SearchResultsInterface
{
    /**
     * Get pages list.
     *
     * @return \Magento\Cms\Api\Data\PageInterface[]
     */
    public function getItems();

    /**
     * Set pages list.
     *
     * @param \Magento\Cms\Api\Data\PageInterface[] $items
     * @return $this
     */
    public function setItems(array $items);
}
