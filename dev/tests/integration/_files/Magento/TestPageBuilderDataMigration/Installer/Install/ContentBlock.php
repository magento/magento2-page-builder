<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\TestPageBuilderDataMigration\Installer\Install;

use Magento\TestPageBuilderDataMigration\EntitySetupFactory;
use Magento\TestPageBuilderDataMigration\EntitySetup;

class ContentBlock extends AbstractInstall
{
    /**
     * @var array
     */
    private $attributeData = [];

    /**
     * @var array
     */
    private $unresolvedAdditionalData = [];

    /**
     * @var \Magento\TestPageBuilderDataMigration\Model\Attribute\ContentBlockFactory
     */
    protected $contentBlockFactory;

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
     * @var \Magento\TestPageBuilderDataMigration\Model\ResourceModel\Attribute\ContentBlock
     */
    protected $contentBlockResource;

    /**
     * ContentBlock constructor.
     *
     * @param \Magento\Framework\Model\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param EntitySetupFactory $entitySetupFactory
     * @param \Magento\PageBuilder\Model\ResourceModel\Entity $entity
     * @param \Magento\TestPageBuilderDataMigration\Model\Attribute\ContentBlockFactory $contentBlockFactory
     * @param \Magento\TestPageBuilderDataMigration\Model\ResourceModel\Attribute\ContentBlock $contentBlockResource
     * @param \Magento\Eav\Model\Entity\AttributeFactory $eavAttributeFactory
     * @param \Magento\Eav\Model\ResourceModel\Entity\Attribute\CollectionFactory $eavAttributeCollectionFactory
     * @param \Magento\Eav\Model\Entity\Attribute\GroupFactory $eavAttributeGroupFactory
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null $resourceCollection
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        EntitySetupFactory $entitySetupFactory,
        \Magento\PageBuilder\Model\ResourceModel\Entity $entity,
        \Magento\TestPageBuilderDataMigration\Model\Attribute\ContentBlockFactory $contentBlockFactory,
        \Magento\TestPageBuilderDataMigration\Model\ResourceModel\Attribute\ContentBlock $contentBlockResource,
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
            $contentBlockFactory,
            $contentBlockResource,
            $resource,
            $resourceCollection,
            $data
        );

        $this->contentBlockFactory = $contentBlockFactory;
        $this->contentBlockResource = $contentBlockResource;

        $this->eavAttributeFactory = $eavAttributeFactory;
        $this->eavAttributeCollectionFactory = $eavAttributeCollectionFactory;
        $this->eavAttributeGroupFactory = $eavAttributeGroupFactory;
    }

    /**
     * Create a single content block
     *
     * @param             $contentBlockData
     * @param EntitySetup $eavSetup
     * @param bool        $contentBlockIdentifier
     *
     * @return $this
     * @throws \Exception
     */
    public function createContentBlock($contentBlockData, EntitySetup $eavSetup, $contentBlockIdentifier = false)
    {
        // Set the attribute code into the data if passed separately
        if ($contentBlockIdentifier === false && isset($contentBlockData['identifier'])) {
            $contentBlockIdentifier = $contentBlockData['identifier'];
            unset($contentBlockData['identifier']);
        }

        // Ensure the data has an attribute code
        if (!$contentBlockIdentifier || empty($contentBlockIdentifier)) {
            throw new \Exception('No content block identifier defined');
        }

        // Add the new attribute providing it doesn't already exist
        if (!$this->contentBlockExists($contentBlockIdentifier)) {
            if (!isset($contentBlockData['attribute_data'])) {
                throw new \Exception('No attribute data present for content block ' . $contentBlockIdentifier);
            }
            $attributeData = $contentBlockData['attribute_data'];

            $contentBlockDataObject = new \Magento\Framework\DataObject();
            $contentBlockDataObject->addData($contentBlockData);

            // Remove the unneeded extra data from the object
            $contentBlockDataObject->unsetData('group')->unsetData('attribute_data');
            $contentBlockDataObject->setData('attribute_set_name', $contentBlockDataObject->getData('name'));

            /* @var $attributes array|bool */
            $attributes = (isset($attributeData['attributes']) &&
                is_array($attributeData['attributes'])) ? $attributeData['attributes'] : false;
            if (!$attributes) {
                throw new \Exception('No attributes are associated with ' . $contentBlockIdentifier);
            }

            $attributeGroups = (isset($attributeData['groups']) &&
                is_array($attributeData['attributes'])) ? $attributeData['groups'] : false;

            // Determine if this content block has all the required attributes
            $missingAttributes = [];
            foreach ($attributes as $attributeCode) {
                if (!$this->attributeExists($attributeCode, $eavSetup)) {
                    $missingAttributes[] = $attributeCode;
                }
            }

            // Content blocks require all attributes to be present on creation
            if (count($missingAttributes) > 0) {
                throw new \Exception(count($missingAttributes) . ' attribute dependencies are missing for content ' .
                    'block ' . $contentBlockIdentifier . ': ' . implode(', ', $missingAttributes));
            }

            /* @var $contentBlock \Magento\TestPageBuilderDataMigration\Model\Attribute\ContentBlock */
            $contentBlock = $this->contentBlockFactory->create();

            // Pass the data from the installation json into the new content block model
            $contentBlock->setData($contentBlockDataObject->getData());

            // Save the content block
            $this->contentBlockResource->save($contentBlock);

            // Build up the attributes and groups
            $contentBlock->setGroups($this->buildGroups($contentBlock, $attributeGroups));

            $this->contentBlockResource->save($contentBlock);
        }

        return $this;
    }

    /**
     * @param $contentBlocks
     * @param $installData
     * @param EntitySetup $eavSetup
     *
     * @return $this
     * @throws \Exception
     */
    public function createContentBlocks($contentBlocks, $installData, EntitySetup $eavSetup)
    {
        if (is_array($installData) && !empty($installData)) {
            $this->setInstallData($installData);
        }

        if (is_array($contentBlocks)) {
            foreach ($contentBlocks as $contentBlock) {
                if (isset($contentBlock['identifier'])) {
                    $this->createContentBlock($contentBlock, $eavSetup, $contentBlock['identifier']);
                }
            }
        }

        return $this;
    }

    /**
     * @param \Magento\TestPageBuilderDataMigration\Model\Attribute\ContentBlock $contentBlock
     * @param $attributeGroups
     *
     * @return array
     */
    private function buildGroups(
        \Magento\TestPageBuilderDataMigration\Model\Attribute\ContentBlock $contentBlock,
        $attributeGroups
    ) {
        $newGroups = [];
        foreach ($attributeGroups as $group) {
            $groupAttributes = isset($group['attributes']) ? $group['attributes'] : [];
            unset($group['attributes']);
            // Create the group
            $groupObject = $this->eavAttributeGroupFactory->create();
            $groupObject->setData($group);
            $groupObject->setAttributeSetId($contentBlock->getAttributeSetId());
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
                        ->setAttributeSetId($contentBlock->getAttributeSetId())
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
