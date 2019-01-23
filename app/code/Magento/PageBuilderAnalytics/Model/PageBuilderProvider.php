<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilderAnalytics\Model;


use Magento\Cms\Model\ResourceModel\Page\CollectionFactory;

/**
 * Provides PageBuilder content type report.
 */
class PageBuilderProvider
{
    /**
     * @var \Magento\Cms\Model\ResourceModel\Page\CollectionFactory
     */
    private $collectionFactory;

    /**
     * PageBuilderProvider constructor.
     *
     * @param CollectionFactory $collectionFactory
     */
    public function __construct(CollectionFactory $collectionFactory)
    {
        $this->collectionFactory = $collectionFactory;
    }

    /**
     * Returns report data for CMS pages
     *
     * @return \IteratorIterator
     */
    public function getReport()
    {
        // move content types elsewhere and load
        $contentTypes = ['row', 'column', 'tabs', 'tab-item', 'text', 'heading', 'buttons', 'button-item', 'divider',
            'html', 'image', 'video', 'banner', 'slider', 'slide', 'map', 'block', 'dynamic_block', 'products'];

        /**
         * @var \Magento\Cms\Model\ResourceModel\Page\Collection
         */
        $collection = $this->collectionFactory->create();
        // build select by iterating content types
        foreach ($contentTypes as $contentType) {
            $expr = 'sum((char_length(content) - char_length(replace(content, \'data-role=\"' . $contentType .
                '\", \'\'))) / ' . strlen($contentType) . ')';
            $collection->addExpressionFieldToSelect($contentType, $expr, 'content');
        }
        $contentTypeReport = $collection->getData();
        return new \IteratorIterator(new \ArrayIterator($contentTypeReport ?: []));
    }
}
