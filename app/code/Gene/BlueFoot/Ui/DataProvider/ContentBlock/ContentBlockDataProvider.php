<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Ui\DataProvider\ContentBlock;

use \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory;

/**
 * Class ContentBlockDataProvider
 */
class ContentBlockDataProvider extends \Magento\Ui\DataProvider\AbstractDataProvider
{

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Attribute\Collection
     */
    protected $collection;

    /**
     * ContentBlockDataProvider constructor.
     * @param string $name
     * @param string $primaryFieldName
     * @param string $requestFieldName
     * @param \Gene\BlueFoot\Model\ResourceModel\Attribute\CollectionFactory $collectionFactory
     * @param array $meta
     * @param array $data
     */
    public function __construct(
        $name,
        $primaryFieldName,
        $requestFieldName,
        CollectionFactory $collectionFactory,
        $meta = [],
        $data = []
    ) {
        parent::__construct(
            $name,
            $primaryFieldName,
            $requestFieldName,
            $meta,
            $data
        );

        $this->collection = $collectionFactory->create();
    }
}
