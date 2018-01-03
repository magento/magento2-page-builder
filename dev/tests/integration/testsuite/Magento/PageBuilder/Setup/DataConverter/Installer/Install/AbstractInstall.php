<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter\Installer\Install;

use Gene\BlueFoot\Api\ContentBlockRepositoryInterface;
use Magento\PageBuilder\Setup\DataConverter\EntitySetupFactory;
use Magento\PageBuilder\Setup\DataConverter\EntitySetup;

/**
 * Class Attribute
 */
class AbstractInstall extends \Magento\Framework\Model\AbstractModel
{
    /**
     * @var \Gene\BlueFoot\Setup\EntitySetupFactory
     */
    protected $entitySetupFactory;

    /**
     * @var \Magento\Eav\Model\Entity\Type
     */
    protected $entityType;

    /**
     * @var \Magento\Framework\Filesystem\Io\File
     */
    protected $ioFile;

    /**
     * @var \Magento\Framework\Module\Dir\Reader
     */
    protected $moduleReader;

    /**
     * @var \Gene\BlueFoot\Api\ContentBlockRepositoryInterface
     */
    protected $contentBlockRepository;

    /**
     * @var array
     */
    protected $classMapping = [];

    /**
     * @var null|array
     */
    protected $installData = null;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Entity
     */
    protected $entity;

    /**
     * @var array
     */
    protected $modelFields;

    /**
     * Attribute constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Gene\BlueFoot\Setup\EntitySetupFactory                      $entitySetupFactory
     * @param \Gene\BlueFoot\Model\ResourceModel\Entity                    $entity
     * @param \Magento\Framework\Filesystem\Io\File                        $ioFile
     * @param \Magento\Framework\Module\Dir\Reader                         $moduleReader
     * @param \Gene\BlueFoot\Api\ContentBlockRepositoryInterface           $contentBlockRepositoryInterface
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        EntitySetupFactory $entitySetupFactory,
        \Gene\BlueFoot\Model\ResourceModel\Entity $entity,
        \Magento\Framework\Filesystem\Io\File $ioFile,
        \Magento\Framework\Module\Dir\Reader $moduleReader,
        ContentBlockRepositoryInterface $contentBlockRepositoryInterface,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);

        $this->entitySetupFactory = $entitySetupFactory;
        $this->ioFile = $ioFile;
        $this->moduleReader = $moduleReader;
        $this->contentBlockRepository = $contentBlockRepositoryInterface;

        $this->entity = $entity;

        // Declare the model fields that require to be mapped
        $this->modelFields = ['backend_model', 'frontend_model', 'source_model', 'data_model'];

        $this->loadClassMapping();
    }

    /**
     * Set the install data on the model
     *
     * @param $data
     */
    public function setInstallData($data)
    {
        $this->installData = $data;
    }

    /**
     * Get the entity type ID
     *
     * @return mixed
     */
    public function getEntityTypeId()
    {
        return $this->entity->getEntityType()->getEntityTypeId();
    }

    /**
     * Determine whether an attribute already exists
     *
     * @param             $attributeCode
     * @param EntitySetup $eavSetup
     *
     * @return mixed
     */
    protected function attributeExists($attributeCode, EntitySetup $eavSetup)
    {
        return $eavSetup->getAttribute($this->getEntityTypeId(), $attributeCode, 'attribute_code');
    }

    /**
     * Determine whether an attribute exists, or will exist by the time the installation has finished
     *
     * @param             $attributeCode
     * @param EntitySetup $eavSetup
     *
     * @return bool
     */
    protected function attributeWillExist($attributeCode, EntitySetup $eavSetup)
    {
        // Check to see if the attribute already exists?
        if ($this->attributeExists($attributeCode, $eavSetup)) {
            return true;
        }

        // Check to see if the attribute will exist after the installation is finished
        if (isset($this->installData) && isset($this->installData['attributes'])) {
            if ($this->findEntityByKey($this->installData['attributes'], 'attribute_code', $attributeCode)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine if a content block exists
     *
     * @param $identifier
     *
     * @return bool
     */
    protected function contentBlockExists($identifier)
    {
        try {
            $contentBlock = $this->contentBlockRepository->getByIdentifier($identifier);
            if ($contentBlock->getId()) {
                return true;
            }
        } catch (\Exception $e) {
            return false;
        }

        return false;
    }

    /**
     * Will a content block exist after installation has completed?
     *
     * @param $identifier
     *
     * @return bool
     */
    protected function contentBlockWillExist($identifier)
    {
        if ($this->contentBlockExists($identifier)) {
            return true;
        }

        if (isset($this->installData) && isset($this->installData['content_blocks'])) {
            if ($this->findEntityByKey($this->installData['content_blocks'], 'identifier', $identifier)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Find a row in data via a key and value
     *
     * @param $data
     * @param $key
     * @param $value
     *
     * @return bool
     */
    protected function findEntityByKey($data, $key, $value)
    {
        // Check if the attribute data has been set
        if (empty($data)) {
            return false;
        }

        foreach ($data as $attribute) {
            if (isset($attribute[$key]) && $attribute[$key] == $value) {
                return $attribute;
            }
        }

        return false;
    }

    /**
     * Load in the class mappings from various json strings
     *
     * @throws \Exception
     * @throws \Zend_Json_Exception
     */
    protected function loadClassMapping()
    {
        $this->classMapping = array_merge(
            $this->classMapping,
            [
                "eav/entity_attribute_backend_array" => "Magento\\Eav\\Model\\Entity\\Attribute\\Backend\\ArrayBackend",
                "eav/entity_attribute_source_boolean" => "Magento\\Eav\\Model\\Entity\\Attribute\\Source\\Boolean",
                "eav/entity_attribute_source_table" => "Magento\\Eav\\Model\\Entity\\Attribute\\Source\\Table",
                "gene_bluefoot/attribute_source_entity_child" => "Gene\\BlueFoot\\Model\\Attribute\\Source\\Entity\\Child",
                "gene_bluefoot/attribute_backend_image" => "",
                "gene_bluefoot/attribute_data_widget_app_list" => "",
                "gene_bluefoot/attribute_data_widget_app_single" => "",
                "gene_bluefoot/attribute_data_widget_staticblock" => "Gene\\BlueFoot\\Model\\Attribute\\Data\\Widget\\StaticBlock",
                "gene_bluefoot/attribute_data_widget_category" => "Gene\\BlueFoot\\Model\\Attribute\\Data\\Widget\\Category",
                "gene_bluefoot/attribute_data_widget_map" => "Gene\\BlueFoot\\Model\\Attribute\\Data\\Widget\\Map",
                "gene_bluefoot/attribute_data_widget_product" => "Gene\\BlueFoot\\Model\\Attribute\\Data\\Widget\\Product",
                "gene_bluefoot/attribute_data_widget_video" => "Gene\\BlueFoot\\Model\\Attribute\\Data\\Widget\\Video"
            ]
        );
    }

    /**
     * Map classes from Magento 1 to Magento 2
     *
     * See the Setup/data/class_mapping/*.json files for the mappings used here
     *
     * @param $data
     */
    protected function mapClasses(&$data)
    {
        foreach ($this->modelFields as $field) {
            if (isset($data[$field]) && isset($this->classMapping[$data[$field]])) {
                $data[$field] = $this->classMapping[$data[$field]];
            }
        }

        return $data;
    }
}
