<?php
/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
 */

namespace Magento\PageBuilder\Api\Data;

use Magento\Framework\Api\SearchResultsInterface;

/**
 * @api
 */
interface TemplateSearchResultsInterface extends SearchResultsInterface
{
    /**
     * Get template list
     *
     * @return TemplateInterface[]
     */
    public function getItems();

    /**
     * Set template list
     *
     * @param TemplateInterface[] $items
     * @return $this
     */
    public function setItems(array $items);
}
