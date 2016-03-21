<?php

namespace Gene\BlueFoot\Model\Stage;

/**
 * Class Plugin
 *
 * @package Gene\BlueFoot\Model\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Build extends \Magento\Framework\Model\AbstractModel
{
    /**
     * @var \Magento\Framework\ObjectManagerInterface|null
     */
    protected $_objectManager = null;

    /**
     * @var array
     */
    protected $_attributeData;

    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    protected $_configInterface;

    /**
     * @var \Magento\Framework\View\LayoutFactory
     */
    protected $_layoutFactory;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory
     */
    protected $_entityCollectionFactory;

    /**
     * @var \Magento\Framework\Data\CollectionFactory
     */
    protected $_dataCollectionFactory;

    /**
     * Build constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Magento\Framework\ObjectManagerInterface                    $objectManager
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface                  $configInterface
     * @param \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory  $entityCollectionFactory
     * @param \Magento\Framework\View\LayoutFactory                        $layoutFactory
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\ObjectManagerInterface $objectManager,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory $entityCollectionFactory,
        \Magento\Framework\View\LayoutFactory $layoutFactory,
        \Magento\Framework\Data\CollectionFactory $dataCollectionFactory,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    )
    {
        $this->_objectManager = $objectManager;
        $this->_configInterface = $configInterface;
        $this->_layoutFactory = $layoutFactory;
        $this->_entityCollectionFactory = $entityCollectionFactory;
        $this->_dataCollectionFactory = $dataCollectionFactory;

        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
    }

    /**
     * Return the entity config for a number of entity ID's
     *
     * @param $entityIds
     *
     * @return array
     * @throws \Exception
     */
    public function getEntityConfig($entityIds)
    {
        // They should be unique, but just in case
        $entityIds = array_unique($entityIds);

        // Retrieve all the entities
        $entities = $this->_entityCollectionFactory->create();
        $entities->addAttributeToSelect('*')
            ->addAttributeToFilter('entity_id', $entityIds);

        $entityData = $this->_dataCollectionFactory->create();

        if($entities->getSize()) {
            // Build up the entities
            foreach ($entities as $entity) {
                $obj = new \Magento\Framework\DataObject();
                $obj->setData($this->cleanseData($entity->getData()));
                $obj->setData('preview_view', $this->cleanseData($this->buildPreviewView($entity)));
                $entityData->addItem($obj);
            }
        }

        //Mage::dispatchEvent('gene_bluefoot_build_config_entities', array('entities' => $entityData));

        // Convert $entityData to an array
        $entityArray = [];
        foreach($entityData as $entity) {
            $entityArray[$entity->getEntityId()] = $entity->getData();
        }

        return $entityArray;
    }

    /**
     * Remove the fields from the main entity table
     *
     * @param $fields
     *
     * @return mixed
     */
    public function cleanseData($fields)
    {
        // We don't want this data
        $removeField = ['entity_type_id', 'identifier', 'created_at', 'updated_at', 'is_active', 'attribute_set_id'];

        // Loop through and remove the fields
        foreach($removeField as $key) {
            unset($fields[$key]);
        }

        return $fields;
    }


    /**
     * Build up the data required to build the preview view within the page builder
     *
     * @param \Gene\BlueFoot\Model\Entity $entity
     *
     * @return array
     */
    public function buildPreviewView(\Gene\BlueFoot\Model\Entity $entity)
    {
        $previewView = [];
        foreach ($entity->getData() as $key => $value) {
            // Determine whether or not we can loads this entities attribute
            if ($attribute = $entity->getResource()->getAttribute($key)) {
                $previewView[$key] = $attribute->getFrontend()->getValue($entity);

                // Does this particular attribute have a data model?
                if ($dataModel = $attribute->getDataModel($entity)) {
                    if (method_exists($dataModel, 'asJson')) {
                        $previewView[$key] = $dataModel->asJson();
                    }
                }
            } else {
                $previewView[$key] = $value;
            }
        }
        return $previewView;
    }

}