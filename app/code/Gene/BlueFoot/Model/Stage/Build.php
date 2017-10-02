<?php

namespace Gene\BlueFoot\Model\Stage;

use Magento\Framework\Api\SearchCriteriaBuilder;
use Gene\BlueFoot\Api\EntityRepositoryInterface;
use Gene\BlueFoot\Api\ContentBlockRepositoryInterface;

/**
 * Class Build
 *
 * @package Gene\BlueFoot\Model\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Build extends \Magento\Framework\Model\AbstractModel
{
    /**
     * @var array
     */
    protected $attributeData;

    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    protected $configInterface;

    /**
     * @var \Magento\Framework\View\LayoutFactory
     */
    protected $layoutFactory;

    /**
     * @var \Magento\Framework\Data\CollectionFactory
     */
    protected $dataCollectionFactory;

    /**
     * @var \Gene\BlueFoot\Model\Attribute\ContentBlockFactory
     */
    protected $contentBlockFactory;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\EntityFactory
     */
    protected $entityFactory;

    /**
     * @var \Magento\Framework\Api\SearchCriteriaBuilder
     */
    protected $searchCriteriaBuilder;

    /**
     * @var \Gene\BlueFoot\Api\EntityRepositoryInterface
     */
    protected $entityRepositoryInterface;

    /**
     * @var \Gene\BlueFoot\Api\ContentBlockRepositoryInterface
     */
    protected $contentBlockRepositoryInterface;

    /**
     * Build constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface                  $configInterface
     * @param \Gene\BlueFoot\Model\EntityFactory                           $entityFactory
     * @param \Magento\Framework\View\LayoutFactory                        $layoutFactory
     * @param \Magento\Framework\Data\CollectionFactory                    $dataCollectionFactory
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlockFactory           $contentBlockFactory
     * @param \Magento\Framework\Api\SearchCriteriaBuilder                 $searchCriteriaBuilder
     * @param \Gene\BlueFoot\Api\EntityRepositoryInterface                 $entityRepositoryInterface
     * @param \Gene\BlueFoot\Api\ContentBlockRepositoryInterface           $contentBlockRepositoryInterface
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        \Gene\BlueFoot\Model\EntityFactory $entityFactory,
        \Magento\Framework\View\LayoutFactory $layoutFactory,
        \Magento\Framework\Data\CollectionFactory $dataCollectionFactory,
        \Gene\BlueFoot\Model\Attribute\ContentBlockFactory $contentBlockFactory,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        EntityRepositoryInterface $entityRepositoryInterface,
        ContentBlockRepositoryInterface $contentBlockRepositoryInterface,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->configInterface = $configInterface;
        $this->layoutFactory = $layoutFactory;
        $this->entityFactory = $entityFactory;
        $this->dataCollectionFactory = $dataCollectionFactory;
        $this->contentBlockFactory = $contentBlockFactory;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->entityRepositoryInterface = $entityRepositoryInterface;
        $this->contentBlockRepositoryInterface = $contentBlockRepositoryInterface;

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
        $searchCriteria = $this->searchCriteriaBuilder->addFilter('entity_id', $entityIds, 'in')->create();

        /* @var $entities \Magento\Framework\Api\SearchResults */
        $entities = $this->entityRepositoryInterface->getList($searchCriteria);

        // Create an empty collection to be populated by the search results
        $entityData = $this->dataCollectionFactory->create();

        if ($entities->getTotalCount() > 0) {
            // Build up the entities
            /* @var $entity \Gene\BlueFoot\Model\Entity */
            foreach ($entities->getItems() as $entity) {
                $obj = new \Magento\Framework\DataObject();
                $obj->setData($this->cleanseData($entity->getData()));
                $obj->setData('preview_view', $this->cleanseData($this->buildPreviewView($entity)));
                $entityData->addItem($obj);
            }
        }

        $this->_eventManager->dispatch('gene_bluefoot_build_config_entities', ['entities' => $entityData]);

        // Convert $entityData to an array
        $entityArray = [];
        foreach ($entityData as $entity) {
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
        foreach ($removeField as $key) {
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

    /**
     * Create a temporary entity, and use it to load the data models
     *
     * @param $contentType
     * @param $data
     * @param $fields
     *
     * @return bool
     */
    public function buildDataModelUpdate($contentType, $data, $fields)
    {
        $attributeSet = $this->contentBlockRepositoryInterface->getByIdentifier($contentType);
        if ($attributeSet) {
            // Format the form data
            $formData = $data;
            $formData['attribute_set_id'] = $attributeSet->getId();

            // Create our entity with the correct attribute set id
            $entity = $this->entityFactory->create();
            $entity->setData($formData);

            return $this->getDataModelValues($entity, $fields);
        }

        return false;
    }

    /**
     * Get the data model values
     *
     * @param \Gene\BlueFoot\Model\Entity $entity
     * @param                             $fields
     *
     * @return array
     */
    public function getDataModelValues(\Gene\BlueFoot\Model\Entity $entity, $fields)
    {
        $dataModelValues = array();

        foreach ($fields as $field) {
            $dataModelValues[$field] = $entity->getData($field);

            // Determine whether or not we can loads this entities attribute
            if ($attribute = $entity->getResource()->getAttribute($field)) {
                // Does this particular attribute have a data model?
                if ($dataModel = $attribute->getDataModel($entity)) {
                    if (method_exists($dataModel, 'asJson')) {
                        $dataModelValues[$field] = $dataModel->asJson();
                    }
                }
            }
        }

        return $dataModelValues;
    }
}
