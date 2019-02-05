<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\TestModulePageBuilderDataMigration\Model\Install;

use Magento\TestModulePageBuilderDataMigration\Setup\EntitySetupFactory;
use Magento\TestModulePageBuilderDataMigration\Setup\EntitySetup;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class ContentType extends AbstractInstall
{
    /**
     * @var \Magento\TestModulePageBuilderDataMigration\Model\Attribute\ContentTypeFactory
     */
    private $contentTypeFactory;

    /**
     * @var \Magento\Eav\Model\Entity\AttributeFactory
     */
    private $eavAttributeFactory;

    /**
     * @var \Magento\Eav\Model\ResourceModel\Entity\Attribute\CollectionFactory
     */
    private $eavAttributeCollectionFactory;

    /**
     * @var \Magento\Eav\Model\Entity\Attribute\GroupFactory
     */
    private $eavAttributeGroupFactory;

    /**
     * @var \Magento\TestModulePageBuilderDataMigration\Model\ResourceModel\Attribute\ContentType
     */
    private $contentTypeResource;

    /**
     * Constructor
     *
     * @param \Magento\Framework\Model\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param EntitySetupFactory $entitySetupFactory
     * @param \Magento\PageBuilderDataMigration\Model\ResourceModel\Entity $entity
     * @param \Magento\TestModulePageBuilderDataMigration\Model\Attribute\ContentTypeFactory $contentTypeFactory
     * @param \Magento\TestModulePageBuilderDataMigration\Model\ResourceModel\Attribute\ContentType
     *        $contentTypeResource
     * @param \Magento\Eav\Model\Entity\AttributeFactory $eavAttributeFactory
     * @param \Magento\Eav\Model\ResourceModel\Entity\Attribute\CollectionFactory $eavAttributeCollectionFactory
     * @param \Magento\Eav\Model\Entity\Attribute\GroupFactory $eavAttributeGroupFactory
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null $resourceCollection
     * @param array $data
     *
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        EntitySetupFactory $entitySetupFactory,
        \Magento\PageBuilderDataMigration\Model\ResourceModel\Entity $entity,
        \Magento\TestModulePageBuilderDataMigration\Model\Attribute\ContentTypeFactory $contentTypeFactory,
        \Magento\TestModulePageBuilderDataMigration\Model\ResourceModel\Attribute\ContentType $contentTypeResource,
        \Magento\Eav\Model\Entity\AttributeFactory $eavAttributeFactory,
        \Magento\Eav\Model\ResourceModel\Entity\Attribute\CollectionFactory $eavAttributeCollectionFactory,
        \Magento\Eav\Model\Entity\Attribute\GroupFactory $eavAttributeGroupFactory,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct(
            $context,
            $registry,
            $entitySetupFactory,
            $entity,
            $contentTypeFactory,
            $contentTypeResource,
            $resource,
            $resourceCollection,
            $data
        );

        $this->contentTypeFactory = $contentTypeFactory;
        $this->contentTypeResource = $contentTypeResource;
        $this->eavAttributeFactory = $eavAttributeFactory;
        $this->eavAttributeCollectionFactory = $eavAttributeCollectionFactory;
        $this->eavAttributeGroupFactory = $eavAttributeGroupFactory;
    }

    /**
     * Create a single content type
     *
     * @param array $contentTypeData
     * @param EntitySetup $eavSetup
     * @param bool $contentTypeIdentifier
     * @return $this
     * @throws \Exception
     *
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    public function createContentType($contentTypeData, EntitySetup $eavSetup, $contentTypeIdentifier = false)
    {
        // Set the attribute code into the data if passed separately
        if ($contentTypeIdentifier === false && isset($contentTypeData['identifier'])) {
            $contentTypeIdentifier = $contentTypeData['identifier'];
            unset($contentTypeData['identifier']);
        }

        // Ensure the data has an attribute code
        if (!$contentTypeIdentifier || empty($contentTypeIdentifier)) {
            throw new \Exception('No content type identifier defined');
        }

        // Add the new attribute providing it doesn't already exist
        if (!$this->contentTypeExists($contentTypeIdentifier)) {
            if (!isset($contentTypeData['attribute_data'])) {
                throw new \Exception('No attribute data present for content type ' . $contentTypeIdentifier);
            }
            $attributeData = $contentTypeData['attribute_data'];

            $contentTypeDataObject = new \Magento\Framework\DataObject();
            $contentTypeDataObject->addData($contentTypeData);

            // Remove the unneeded extra data from the object
            $contentTypeDataObject->unsetData('group')->unsetData('attribute_data');
            $contentTypeDataObject->setData('attribute_set_name', $contentTypeDataObject->getData('name'));

            /* @var $attributes array|bool */
            $attributes = (isset($attributeData['attributes']) &&
                is_array($attributeData['attributes'])) ? $attributeData['attributes'] : false;
            if (!$attributes) {
                throw new \Exception('No attributes are associated with ' . $contentTypeIdentifier);
            }

            $attributeGroups = (isset($attributeData['groups']) &&
                is_array($attributeData['attributes'])) ? $attributeData['groups'] : false;

            // Determine if this content type has all the required attributes
            $missingAttributes = [];
            foreach ($attributes as $attributeCode) {
                if (!$this->attributeExists($attributeCode, $eavSetup)) {
                    $missingAttributes[] = $attributeCode;
                }
            }

            // Content types require all attributes to be present on creation
            if (count($missingAttributes) > 0) {
                throw new \Exception(count($missingAttributes) . ' attribute dependencies are missing for content ' .
                    'block ' . $contentTypeIdentifier . ': ' . implode(', ', $missingAttributes));
            }

            /* @var $contentType \Magento\TestModulePageBuilderDataMigration\Model\Attribute\ContentType */
            $contentType = $this->contentTypeFactory->create();

            // Pass the data from the installation json into the new content type model
            $contentType->setData($contentTypeDataObject->getData());

            // Save the content type
            $this->contentTypeResource->save($contentType);

            // Build up the attributes and groups
            $contentType->setGroups($this->buildGroups($contentType, $attributeGroups));

            $this->contentTypeResource->save($contentType);
        }

        return $this;
    }

    /**
     * @param array $contentTypes
     * @param mixed $installData
     * @param EntitySetup $eavSetup
     * @return $this
     * @throws \Exception
     */
    public function createContentTypes($contentTypes, $installData, EntitySetup $eavSetup)
    {
        if (is_array($installData) && !empty($installData)) {
            $this->setInstallData($installData);
        }

        if (is_array($contentTypes)) {
            foreach ($contentTypes as $contentType) {
                if (isset($contentType['identifier'])) {
                    $this->createContentType($contentType, $eavSetup, $contentType['identifier']);
                }
            }
        }

        return $this;
    }

    /**
     * @param \Magento\TestModulePageBuilderDataMigration\Model\Attribute\ContentType $contentType
     * @param array $attributeGroups
     * @return array
     */
    private function buildGroups(
        \Magento\TestModulePageBuilderDataMigration\Model\Attribute\ContentType $contentType,
        $attributeGroups
    ) {
        $newGroups = [];
        foreach ($attributeGroups as $group) {
            $groupAttributes = isset($group['attributes']) ? $group['attributes'] : [];
            unset($group['attributes']);
            // Create the group
            $groupObject = $this->eavAttributeGroupFactory->create();
            $groupObject->setData($group);
            $groupObject->setAttributeSetId($contentType->getAttributeSetId());
            $attributeCodes = [];
            foreach ($groupAttributes as $gAttribute) {
                $attrCode = isset($gAttribute['attribute_code']) ? $gAttribute['attribute_code'] : false;
                if ($attrCode) {
                    $attributeCodes[] = $attrCode;
                }
            }
            if (count($attributeCodes) > 0) {
                $groupAttributesCollection = $this->eavAttributeCollectionFactory->create()
                    ->setCodeFilter($attributeCodes)
                    ->setEntityTypeFilter($this->getEntityTypeId())
                    ->load();
                $modelAttributeArray = [];
                foreach ($groupAttributesCollection as $gAttribute) {
                    $newAttribute = $this->eavAttributeFactory->create()
                        ->setId($gAttribute->getId())
                        ->setAttributeSetId($contentType->getAttributeSetId())
                        ->setEntityTypeId($this->getEntityTypeId())
                        ->setSortOrder($gAttribute->getSortOrder());
                    $modelAttributeArray[] = $newAttribute;
                }
                $groupObject->setAttributes($modelAttributeArray);
                $newGroups[] = $groupObject;
            }
        }
        return $newGroups;
    }
}
