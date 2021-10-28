<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Ui\Component\UrlInput\Page;

use Magento\Cms\Model\ResourceModel\Page\CollectionFactory;
use Magento\Framework\EntityManager\MetadataPool;
use Magento\Cms\Api\Data\PageInterface;

/** Returns options for cms pages link tye of Url input ui component */
class Options implements \Magento\Framework\Data\OptionSourceInterface
{
    /**
     * @var array
     */
    private $options;

    /**
     * @var CollectionFactory
     */
    private $collectionFactory;

    /**
     * @var MetadataPool
     */
    private $metadataPool;

    /**
     * @param CollectionFactory $collectionFactory
     * @param MetadataPool $metadataPool
     */
    public function __construct(
        CollectionFactory $collectionFactory,
        MetadataPool $metadataPool
    ) {
        $this->collectionFactory = $collectionFactory;
        $this->metadataPool = $metadataPool;
    }

    /**
     * @inheritdoc
     *
     * @return array
     */
    public function toOptionArray() : array
    {
        if (!$this->options) {
            $cmsPageCollection = $this->collectionFactory->create();
            $identifierField = $this->metadataPool->getMetadata(PageInterface::class)->getIdentifierField();
            $this->options = [];
            /** @var PageInterface $item */
            foreach ($cmsPageCollection as $item) {
                $pageId = $item->getData($identifierField);
                $this->options[$pageId] = [
                    'value' => $pageId,
                    'label' => $item->getTitle(),
                    'identifier' => sprintf(__('ID: %s')->render(), $pageId)
                ];
            }
        }
        return $this->options;
    }
}
