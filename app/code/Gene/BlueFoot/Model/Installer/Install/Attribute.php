<?php

namespace Gene\BlueFoot\Model\Installer\Install;

use Gene\BlueFoot\Api\ContentBlockRepositoryInterface;
use Gene\BlueFoot\Setup\EntitySetupFactory;
use Gene\BlueFoot\Setup\EntitySetup;

/**
 * Class Attribute
 *
 * @package Gene\BlueFoot\Model\Installer
 *
 * @author  Dave Macaulay <dave@gene.co.uk>
 */
class Attribute extends AbstractInstall
{
    /**
     * @var array
     */
    protected $unresolvedAdditionalData = [];

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Entity
     */
    protected $entity;

    /**
     * Provide attribute mapping from the data format in M1 to M2's new structure
     *
     * @var array
     */
    protected $fieldMapping = [
        'global'          => 'is_global',
        'data_model'      => 'data',
        'backend_model'   => 'backend',
        'backend_type'    => 'type',
        'backend_table'   => 'table',
        'frontend_model'  => 'frontend',
        'frontend_input'  => 'input',
        'frontend_label'  => 'label',
        'source_model'    => 'source',
        'is_required'     => 'required',
        'is_user_defined' => 'user_defined',
        'is_unique'       => 'unique',
        'is_global'       => 'global'
    ];

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
        parent::__construct(
            $context,
            $registry,
            $entitySetupFactory,
            $entity,
            $ioFile,
            $moduleReader,
            $contentBlockRepositoryInterface,
            $resource,
            $resourceCollection
        );

        $this->entity = $entity;
    }

    /**
     * Create an attribute
     *
     * @param             $attributeData
     * @param EntitySetup $eavSetup
     * @param bool        $attributeCode
     *
     * @return $this
     * @throws \Exception
     */
    public function createAttribute($attributeData, EntitySetup $eavSetup, $attributeCode = false)
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
        $attribute = $this->attributeExists($attributeCode, $eavSetup);
        if (!$attribute) {
            // Force the eavSetup to not attempt to automatically create a group, as the .json file implements the
            // names differently there is no need to cache and restore this data. Eg. Magento expects backend, where as
            // we define backend_model as backend_model
            $attributeData['user_defined'] = 1;
            $attributeData['group'] = '';

            // Map any Magento 1 classes over to their Magento 2 counterparts
            $this->mapClasses($attributeData);

            // The label may be given to us as an array
            if (is_array($attributeData['frontend_label']) && !empty($attributeData['frontend_label'])) {
                $attributeData['frontend_label'] = current($attributeData['frontend_label']);
            }

            // If the attribute has an entity_allowed_block_type, we need to update the additional_data if the
            // content block will exist once the installation is finished
            if (isset($attributeData['entity_allowed_block_type']) && $attributeData['entity_allowed_block_type']) {
                if ($this->contentBlockWillExist($attributeData['entity_allowed_block_type'])) {
                    $attributeData['additional_data']['entity_allowed_block_type']
                        = $attributeData['entity_allowed_block_type'];
                    $this->unresolvedAdditionalData[] = $attributeCode;
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

            // Map over any field keys that have changed from M1
            foreach ($attributeData as $key => $value) {
                if (in_array($key, array_keys($this->fieldMapping))) {
                    $attributeData[$this->fieldMapping[$key]] = $attributeData[$key];
                    unset($attributeData[$key]);
                }
            }

            // Add the attribute into Magento
            $eavSetup->addAttribute($this->getEntityTypeId(), $attributeCode, $attributeData);
        }

        return $this;
    }

    /**
     * Create multiple attributes
     *
     * @param             $attributes
     * @param             $installData
     * @param EntitySetup $eavSetup
     *
     * @return $this
     */
    public function createAttributes($attributes, $installData, EntitySetup $eavSetup)
    {
        if (is_array($installData) && !empty($installData)) {
            $this->setInstallData($installData);
        }

        if (is_array($attributes)) {
            foreach ($attributes as $attribute) {
                if (isset($attribute['attribute_code'])) {
                    $this->createAttribute($attribute, $eavSetup, $attribute['attribute_code']);
                }
            }
        }

        return $this;
    }

    /**
     * Resolve any unmapped ID's in the additional data field
     *
     * @param EntitySetup $eavSetup
     *
     * @return $this
     */
    public function resolveAdditionalData(EntitySetup $eavSetup)
    {
        if (!empty($this->unresolvedAdditionalData)) {
            foreach ($this->unresolvedAdditionalData as $attributeCode) {
                $attribute = $this->entity->getAttribute($attributeCode);
                if ($attribute->getId()) {
                    $additionalData = \Zend_Json::decode($attribute->getAdditionalData());
                    if (isset($additionalData['entity_allowed_block_type'])) {
                        try {
                            $contentBlock = $this->contentBlockRepository->getByIdentifier(
                                $additionalData['entity_allowed_block_type']
                            );
                            if ($contentBlock->getId()) {
                                $additionalData['entity_allowed_block_type'] = $contentBlock->getId();
                            }
                        } catch (\Exception $e) {
                            unset($additionalData['entity_allowed_block_type']);
                        }

                        // Update the attribute
                        $eavSetup->updateAttribute(
                            $this->getEntityTypeId(),
                            $attribute->getId(),
                            'additional_data',
                            \Zend_Json::encode($additionalData)
                        );
                    }
                }
            }

            $this->unresolvedAdditionalData = [];
        }

        return $this;
    }
}
