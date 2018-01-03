<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Api\Data;

use Magento\Framework\Api\SearchResultsInterface;

/**
 * Interface ContentBlockGroupSearchResultsInterface
 */
interface ContentBlockGroupSearchResultsInterface extends SearchResultsInterface
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
