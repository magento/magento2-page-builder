<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Api\Data;

use Magento\Framework\Api\SearchResultsInterface;

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
