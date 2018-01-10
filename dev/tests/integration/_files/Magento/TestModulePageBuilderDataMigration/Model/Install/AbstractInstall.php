<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\TestModulePageBuilderDataMigration\Model\Install;

use Magento\TestModulePageBuilderDataMigration\Setup\EntitySetupFactory;
use Magento\TestModulePageBuilderDataMigration\Setup\EntitySetup;

class AbstractInstall extends \Magento\Framework\Model\AbstractModel
{
    /**
     * @var \Magento\TestModulePageBuilderDataMigration\Setup\EntitySetupFactory
     */
    protected $entitySetupFactory;

    /**
     * @var \Magento\Eav\Model\Entity\Type
     */
    protected $entityType;

    /**
     * @var array
     */
    protected $classMapping = [];

    /**
     * @var null|array
     */
    protected $installData = null;

    /**
     * @var \Magento\PageBuilder\Model\ResourceModel\Entity
     */
    protected $entity;

    /**
     * @var array
     */
    protected $modelFields;

    /**
     * @var \Magento\TestModulePageBuilderDataMigration\Model\Attribute\ContentBlockFactory
     */
    protected $contentBlockFactory;

    /**
     * @var \Magento\TestModulePageBuilderDataMigration\Model\ResourceModel\Attribute\ContentBlock
     */
    protected $contentBlockResource;

    /**
     * AbstractInstall constructor.
     *
     * @param \Magento\Framework\Model\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param EntitySetupFactory $entitySetupFactory
     * @param \Magento\PageBuilder\Model\ResourceModel\Entity $entity
     * @param \Magento\TestModulePageBuilderDataMigration\Model\Attribute\ContentBlockFactory $contentBlockFactory
     * @param \Magento\TestModulePageBuilderDataMigration\Model\ResourceModel\Attribute\ContentBlock $contentBlockResource
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null $resourceCollection
     * @param array $data
     *
     * @throws \Exception
     * @throws \Zend_Json_Exception
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        EntitySetupFactory $entitySetupFactory,
        \Magento\PageBuilder\Model\ResourceModel\Entity $entity,
        \Magento\TestModulePageBuilderDataMigration\Model\Attribute\ContentBlockFactory $contentBlockFactory,
        \Magento\TestModulePageBuilderDataMigration\Model\ResourceModel\Attribute\ContentBlock $contentBlockResource,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    )
    {
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);

        $this->contentBlockFactory = $contentBlockFactory;
        $this->contentBlockResource = $contentBlockResource;
        $this->entitySetupFactory = $entitySetupFactory;

        $this->entity = $entity;

        // Declare the model fields that require to be mapped
        $this->modelFields = ['backend_model', 'frontend_model', 'source_model', 'data_model'];
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
            $contentBlock = $this->contentBlockFactory->create();
            $this->contentBlockResource->load(
                $contentBlock,
                $identifier,
                'entity_type.identifier'
            );
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
    private function getClassMapping()
    {
        return [
            'eav/entity_attribute_backend_array' => \Magento\Eav\Model\Entity\Attribute\Backend\ArrayBackend::class,
            'eav/entity_attribute_source_boolean' => \Magento\Eav\Model\Entity\Attribute\Source\Boolean::class,
            'eav/entity_attribute_source_table' => \Magento\Eav\Model\Entity\Attribute\Source\Table::class,
        ];
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
            if (isset($data[$field]) && isset($this->getClassMapping()[$data[$field]])) {
                $data[$field] = $this->getClassMapping()[$data[$field]];
            }
        }

        return $data;
    }
}
