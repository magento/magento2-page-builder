<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Ui\DataProvider\Template;

use Gene\BlueFoot\Model\ResourceModel\Stage\Template\CollectionFactory;

class DataProvider extends \Magento\Ui\DataProvider\AbstractDataProvider
{
    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Stage\Template\Collection
     */
    protected $collection;

    public function __construct(
        $name,
        $primaryFieldName,
        $requestFieldName,
        CollectionFactory $profileFactory,
        $meta = [],
        $data = []
    ) {
        $this->collection = $profileFactory->create();
        parent::__construct($name, $primaryFieldName, $requestFieldName, $meta, $data);
    }
}