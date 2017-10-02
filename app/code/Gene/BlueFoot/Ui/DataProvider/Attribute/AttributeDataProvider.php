<?php

namespace Gene\BlueFoot\Ui\DataProvider\Attribute;

use \Gene\BlueFoot\Model\ResourceModel\Attribute\CollectionFactory;

/**
 * Class AttributeDataProvider
 *
 * @package Gene\BlueFoot\Ui\DataProvider\ContentBlock
 *
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */
class AttributeDataProvider extends \Magento\Ui\DataProvider\AbstractDataProvider
{

    /**
     * @var \Magento\Cms\Model\ResourceModel\Page\Collection
     */
    protected $collection;

    /**
     * ContentBlockDataProvider constructor.
     * @param string $name
     * @param string $primaryFieldName
     * @param string $requestFieldName
     * @param \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory $collectionFactory
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
