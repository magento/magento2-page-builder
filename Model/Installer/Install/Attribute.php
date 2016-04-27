<?php

namespace Gene\BlueFoot\Model\Installer\Install;

use Gene\BlueFoot\Api\ContentBlockRepositoryInterface;
use Gene\BlueFoot\Setup\EntitySetupFactory;

/**
 * Class Attribute
 *
 * @package Gene\BlueFoot\Model\Installer
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Attribute extends AbstractInstall
{
    /**
     * @var array
     */
    protected $_unresolvedAdditionalData = [];

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Entity
     */
    protected $_entity;

    /**
     * Attribute constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Gene\BlueFoot\Setup\EntitySetupFactory                      $entitySetupFactory
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
        parent::__construct($context, $registry, $entitySetupFactory, $entity, $ioFile, $moduleReader, $contentBlockRepositoryInterface, $resource, $resourceCollection);

        $this->_entity = $entity;
    }

    /**
     * Create an attribute
     *
     * @param            $attributeData
     * @param bool|false $attributeCode
     *
     * @return $this
     * @throws \Exception
     */
    public function createAttribute($attributeData, $attributeCode = false)
    {
        // Set the attribute code into the data if passed separately
        if ($attributeCode === false && isset($attributeData['attribute_code'])) {
            $attributeCode = $attributeData['attribute_code'];
            unset($attributeData['attribute_code']);
        }

        // Ensure the data has an attribute code
        if (!$attributeCode || empty($attributeCode)) {
            throw new \Exception('No attribute code is defined');
        }

        // Add the new attribute providing it doesn't already exist
        if (!$this->_attributeExists($attributeCode)) {

            // Force the eavSetup to not attempt to automatically create a group, as the .json file implements the
            // names differently there is no need to cache and restore this data. Eg. Magento expects backend, where as
            // we define backend_model as backend_model
            $attributeData['user_defined'] = 1;
            $attributeData['group'] = '';

            // Map any Magento 1 classes over to their Magento 2 counterparts
            $this->_mapClasses($attributeData);

            // The label may be given to us as an array
            if (is_array($attributeData['frontend_label']) && !empty($attributeData['frontend_label'])) {
                $attributeData['frontend_label'] = current($attributeData['frontend_label']);
            }

            // If the attribute has an entity_allowed_block_type, we need to update the additional_data if the
            // content block will exist once the installation is finished
            if (isset($attributeData['entity_allowed_block_type']) && $attributeData['entity_allowed_block_type']) {
                if ($this->_contentBlockWillExist($attributeData['entity_allowed_block_type'])) {
                    $attributeData['additional_data']['entity_allowed_block_type'] = $attributeData['entity_allowed_block_type'];
                    $this->_unresolvedAdditionalData[] = $attributeCode;
                }
            }

            // The additional_data needs to be converted back into a JSON string
            if (is_array($attributeData['additional_data'])) {
                if (!empty($attributeData['additional_data'])) {
                    $attributeData['additional_data'] = \Zend_Json::encode($attributeData['additional_data']);
                } else {
                    $attributeData['additional_data'] = '';
                }
            }

            // Add the attribute into Magento
            $this->_eavSetup->addAttribute($this->getEntityTypeId(), $attributeCode, $attributeData);
        }

        return $this;
    }

    /**
     * Create multiple attributes
     *
     * @param       $attributes
     * @param array $installData
     *
     * @return $this
     * @throws \Exception
     */
    public function createAttributes($attributes, $installData)
    {
        if (is_array($installData) && !empty($installData)) {
            $this->setInstallData($installData);
        }

        if (is_array($attributes)) {
            foreach ($attributes as $attribute) {
                if (isset($attribute['attribute_code'])) {
                    $this->createAttribute($attribute, $attribute['attribute_code']);
                }
            }
        }

        return $this;
    }

    /**
     * Resolve any unmapped ID's in the additional data field
     *
     * @return $this
     * @throws \Zend_Json_Exception
     */
    public function resolveAdditionalData()
    {
        if (!empty($this->_unresolvedAdditionalData)) {
            foreach ($this->_unresolvedAdditionalData as $attributeCode) {
                $attribute = $this->_entity->getAttribute($attributeCode);
                if ($attribute->getId()) {
                    $additionalData = \Zend_Json::decode($attribute->getAdditionalData());
                    if (isset($additionalData['entity_allowed_block_type'])) {
                        try {
                            $contentBlock = $this->_contentBlockRepository->getByIdentifier($additionalData['entity_allowed_block_type']);
                            if ($contentBlock->getId()) {
                                $additionalData['entity_allowed_block_type'] = $contentBlock->getId();
                            }
                        } catch (\Exception $e) {
                            unset($additionalData['entity_allowed_block_type']);
                        }

                        // Update the attribute
                        $this->_eavSetup->updateAttribute($this->getEntityTypeId(), $attribute->getId(), 'additional_data', \Zend_Json::encode($additionalData));
                    }
                }
            }

            $this->_unresolvedAdditionalData = [];
        }

        return $this;
    }

}