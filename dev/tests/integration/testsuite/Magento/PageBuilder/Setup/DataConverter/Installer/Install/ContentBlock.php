<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter\Installer\Install;

use Magento\PageBuilder\Setup\DataConverter\EntitySetupFactory;
use Magento\PageBuilder\Setup\DataConverter\EntitySetup;

/**
 * Class ContentBlock
 */
class ContentBlock extends AbstractInstall
{
    /**
     * @var array
     */
    protected $attributeData = [];

    /**
     * @var array
     */
    protected $unresolvedAdditionalData = [];

//    /**
//     * @var \Magento\PageBuilder\Setup\DataConverter\Model\GroupRepository
//     */
//    protected $contentBlockGroupRepository;
//
//    /**
//     * @var \Magento\PageBuilder\Setup\DataConverter\Model\Attribute\ContentBlock\GroupFactory
//     */
//    protected $contentBlockGroupFactory;

    /**
     * @var \Magento\PageBuilder\Setup\DataConverter\Model\Attribute\ContentBlockFactory
     */
    protected $contentBlockFactory;

    /**
     * @var \Magento\Eav\Model\Entity\AttributeFactory
     */
    protected $eavAttributeFactory;

    /**
     * @var \Magento\Eav\Model\ResourceModel\Entity\Attribute\CollectionFactory
     */
    protected $eavAttributeCollectionFactory;

    /**
     * @var \Magento\Eav\Model\Entity\Attribute\GroupFactory
     */
    protected $eavAttributeGroupFactory;

    /**
     * Attribute constructor.
     *
     * @param \Magento\Framework\Model\Context                                    $context
     * @param \Magento\Framework\Registry                                         $registry
     * @param \Gene\BlueFoot\Setup\EntitySetupFactory                             $entitySetupFactory
     * @param \Gene\BlueFoot\Model\ResourceModel\Entity                           $entity
     * @param \Magento\PageBuilder\Setup\DataConverter\Model\ContentBlockRepository    $contentBlockRepository
//     * @param \Magento\PageBuilder\Setup\DataConverter\Model\GroupRepository             $contentBlockGroupRepositoryInterface
//     * @param \Magento\PageBuilder\Setup\DataConverter\Model\Attribute\ContentBlock\GroupFactory            $groupFactory
     * @param \Magento\PageBuilder\Setup\DataConverter\Model\Attribute\ContentBlockFactory                  $contentBlockFactory
     * @param \Magento\Eav\Model\Entity\AttributeFactory                          $eavAttributeFactory
     * @param \Magento\Eav\Model\ResourceModel\Entity\Attribute\CollectionFactory $eavAttributeCollectionFactory
     * @param \Magento\Eav\Model\Entity\Attribute\GroupFactory                    $eavAttributeGroupFactory
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null        $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null                  $resourceCollection
     * @param array                                                               $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        EntitySetupFactory $entitySetupFactory,
        \Gene\BlueFoot\Model\ResourceModel\Entity $entity,
        \Magento\PageBuilder\Setup\DataConverter\Model\ContentBlockRepository $contentBlockRepository,
//        \Magento\PageBuilder\Setup\DataConverter\Model\GroupRepository $contentBlockGroupRepositoryInterface,
//        \Magento\PageBuilder\Setup\DataConverter\Model\Attribute\ContentBlock\GroupFactory $groupFactory,
        \Magento\PageBuilder\Setup\DataConverter\Model\Attribute\ContentBlockFactory $contentBlockFactory,
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
            $contentBlockRepository,
            $resource,
            $resourceCollection
        );

//        $this->contentBlockGroupRepository = $contentBlockGroupRepositoryInterface;
//        $this->contentBlockGroupFactory = $groupFactory;

        $this->contentBlockFactory = $contentBlockFactory;

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

            /* @var $contentBlock \Gene\BlueFoot\Model\Attribute\ContentBlock\Interceptor */
            $contentBlock = $this->contentBlockFactory->create();

            // Pass the data from the installation json into the new content block model
            $contentBlock->setData($contentBlockDataObject->getData());

            // Find or create the group for this content block
//            $groupId = 0;
//            /* @var $group \Gene\BlueFoot\Model\Attribute\ContentBlock\Group */
//            if ($group = $this->findOrCreateGroup($contentBlockData['group'])) {
//                $groupId = $group->getId();
//            }
//
//            // Set the group ID for display in the page builder
//            $contentBlock->setGroupId($groupId);

            // Save before adding in the groups
            $contentBlock->save();

            // Build up the attributes and groups
         //   $contentBlock->setGroups($this->buildGroups($contentBlock, $attributeGroups));

            $contentBlock->save();
        }

        return $this;
    }

    /**
     * Create multiple content blocks
     *
     * @param             $contentBlocks
     * @param             $installData
     * @param EntitySetup $eavSetup
     *
     * @return $this
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
     * Find or create a group for the content block
     *
     * @param $groupCode
     *
     * @return bool
     */
//    protected function findOrCreateGroup($groupCode)
//    {
//        try {
//            if ($group = $this->contentBlockGroupRepository->getByCode($groupCode)) {
//                return $group;
//            }
//        } catch (\Exception $e) {
//            // If the group isn't found, create the group below
//        }
//
//        $group = $this->contentBlockGroupFactory->create();
//        $group->addData([
//            'code'       => $groupCode,
//            'name'       => ucwords($groupCode),
//            'sort_order' => 99,
//            'icon'       => '<i class="fa fa-chevron-down"></i>'
//        ]);
//
//        if ($group->save()) {
//            return $group;
//        }
//
//        return false;
//    }

    /**
     * Build the groups for the content block
     *
     * @param \Magento\PageBuilder\Setup\DataConverter\Model\Attribute\ContentBlock $contentBlock
     * @param                                             $attributeGroups
     *
     * @return array
     * @throws \Magento\Framework\Exception\LocalizedException
     */
//    protected function buildGroups(\Magento\PageBuilder\Setup\DataConverter\Model\Attribute\ContentBlock $contentBlock, $attributeGroups)
//    {
//        $newGroups = [];
//        foreach ($attributeGroups as $group) {
//            $groupAttributes = isset($group['attributes']) ? $group['attributes'] : [];
//            unset($group['attributes']);
//
//            // Create the group
//            $groupObject = $this->eavAttributeGroupFactory->create();
//            $groupObject->setData($group);
//            $groupObject->setAttributeSetId($contentBlock->getAttributeSetId());
//
//            $attributeCodes = [];
//            foreach ($groupAttributes as $gAttribute) {
//                $attrCode = isset($gAttribute['attribute_code']) ? $gAttribute['attribute_code'] : false;
//                if ($attrCode) {
//                    $attributeCodes[] = $attrCode;
//                }
//            }
//
//            if (count($attributeCodes) > 0) {
//                $groupAttributesCollection = $this->eavAttributeCollectionFactory->create()
//                    ->setCodeFilter($attributeCodes)
//                    ->setEntityTypeFilter($this->getEntityTypeId())
//                    ->load();
//
//                $modelAttributeArray = [];
//                foreach ($groupAttributesCollection as $gAttribute) {
//                    $newAttribute = $this->eavAttributeFactory->create()
//                        ->setId($gAttribute->getId())
//                        ->setAttributeSetId($contentBlock->getAttributeSetId())
//                        ->setEntityTypeId($this->getEntityTypeId())
//                        ->setSortOrder($gAttribute->getSortOrder());
//
//                    $modelAttributeArray[] = $newAttribute;
//                }
//                $groupObject->setAttributes($modelAttributeArray);
//                $newGroups[] = $groupObject;
//            }
//        }
//
//        return $newGroups;
//    }
}
