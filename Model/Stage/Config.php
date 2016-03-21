<?php

namespace Gene\BlueFoot\Model\Stage;

/**
 * Class Plugin
 *
 * @package Gene\BlueFoot\Model\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Config extends \Magento\Framework\Model\AbstractModel
{
    /**
     * @var \Magento\Framework\ObjectManagerInterface|null
     */
    protected $_objectManager = null;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory
     */
    protected $_contentBlockCollection;

    /**
     * @var \Magento\Eav\Model\EntityFactory
     */
    protected $_eavEntityFactory;

    /**
     * @var \Magento\Eav\Model\ResourceModel\Entity\Attribute\Group\CollectionFactory
     */
    protected $_groupCollection;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Attribute\CollectionFactory
     */
    protected $_attributeCollection;

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
     * @var \Gene\BlueFoot\Model\ResourceModel\Stage\Template\CollectionFactory
     */
    protected $_templateCollection;

    /**
     * Config constructor.
     *
     * @param \Magento\Framework\Model\Context                                            $context
     * @param \Magento\Framework\Registry                                                 $registry
     * @param \Magento\Framework\ObjectManagerInterface                                   $objectManager
     * @param \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory $contentBlockCollectionFactory
     * @param \Magento\Eav\Model\EntityFactory                                            $eavEntityFactory
     * @param \Magento\Eav\Model\ResourceModel\Entity\Attribute\Group\CollectionFactory   $groupCollectionFactory
     * @param \Gene\BlueFoot\Model\ResourceModel\Attribute\CollectionFactory              $attributeCollection
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface                                 $configInterface
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null                $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null                          $resourceCollection
     * @param array                                                                       $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\ObjectManagerInterface $objectManager,
        \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory $contentBlockCollectionFactory,
        \Magento\Eav\Model\EntityFactory $eavEntityFactory,
        \Magento\Eav\Model\ResourceModel\Entity\Attribute\Group\CollectionFactory $groupCollectionFactory,
        \Gene\BlueFoot\Model\ResourceModel\Attribute\CollectionFactory $attributeCollection,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        \Magento\Framework\View\LayoutFactory $layoutFactory,
        \Gene\BlueFoot\Model\ResourceModel\Stage\Template\CollectionFactory $templateCollectionFactory,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->_objectManager = $objectManager;
        $this->_contentBlockCollection = $contentBlockCollectionFactory;
        $this->_eavEntityFactory = $eavEntityFactory;
        $this->_groupCollection = $groupCollectionFactory;
        $this->_attributeCollection = $attributeCollection;
        $this->_configInterface = $configInterface;
        $this->_layoutFactory = $layoutFactory;
        $this->_templateCollection = $templateCollectionFactory;

        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
    }

    /**
     * Return the config for the page builder instance
     *
     * @return array
     */
    public function getConfig()
    {
        /* @var $structural \Gene\BlueFoot\Model\Stage\Structural */
        $structural = $this->_objectManager->get('Gene\BlueFoot\Model\Stage\Structural');

        $config = [
            'contentTypeGroups' => [ /* @todo */
                'general' => [
                    'icon' => '<i class="fa fa-chevron-down"></i>',
                    'name' => 'General'
                ]
            ],
            'contentTypes' => $this->getContentBlockData(),
            'structural' => $structural->getStructuralConfig(),
            'templates' => $this->getTemplateData()
        ];

        return $config;
    }

    /**
     * Build up template data
     *
     * @return array
     */
    public function getTemplateData()
    {
        $templates = $this->_templateCollection->create();

        if ($templates->getSize()) {
            $templateData = array();
            foreach ($templates as $template) {
                $templateData[] = array(
                    'id' => $template->getId(),
                    'name' => $template->getData('name'),
                    'structure' => $template->getData('structure')
                );
            }
            return $templateData;
        }

        return [];
    }

    /**
     * Build up the content block data
     *
     * @return array
     */
    public function getContentBlockData()
    {
        // Retrieve content blocks
        $contentBlocks = $this->_contentBlockCollection->create();
        $contentBlocks->setEntityTypeFilter($this->_eavEntityFactory->create()->setType(\Gene\BlueFoot\Model\Entity::ENTITY)->getTypeId());

        $contentBlockData = [];
        /* @var $contentBlock \Gene\BlueFoot\Model\Attribute\ContentBlock */
        foreach ($contentBlocks as $contentBlock) {
            $contentBlockData[$contentBlock->getIdentifier()] = $this->_flattenContentBlockData($contentBlock);
        }

        return $contentBlockData;
    }

    /**
     * Flatten the content block data
     *
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock
     *
     * @return array
     */
    protected function _flattenContentBlockData(\Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock)
    {
        $this->_buildAllAttributeData();

        $fields = $this->_getContentBlockFields($contentBlock, $this->_getAttributeGroupData($contentBlock));

        $contentBlockData = [
            'code' => $contentBlock->getIdentifier(),
            'name' => $contentBlock->getName(),
            'icon' => '<i class="' . $contentBlock->getIconClass() . '"></i>',
            'color' => $contentBlock->getColor(),
            'color_theme' => $this->_getColorTheme($contentBlock->getColor()),
            'contentType' => '',
            'group' => ($contentBlock->getGroupId() ? $contentBlock->getGroupId() : 'general'),
            'fields' => $fields,
            'fields_list' => array_keys($fields),
        ];

        // Do we have a preview template for this content block?
        if ($previewTemplate = $this->_getPreviewTemplate($contentBlock)) {
            $contentBlockData['preview_template'] = $previewTemplate;
        }

        return $contentBlockData;
    }

    /**
     * Get the preview template for the content block
     *
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock
     *
     * @return bool
     */
    protected function _getPreviewTemplate(\Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock)
    {
        if ($template = $contentBlock->getItemViewTemplate()) {
            $templatePath = $this->_configInterface->getTemplate($template);
            if ($templatePath && isset($templatePath['file'])) {
                try {
                    /* @var $block \Magento\Framework\View\Element\Template */
                    $block = $this->_layoutFactory->create()->createBlock('Magento\Backend\Block\Template');
                    $block->setTemplate('Gene_BlueFoot::' . $templatePath['file']);
                    if ($block) {
                        return $block->toHtml();
                    }
                } catch (\Exception $e) {
                    return false;
                }
            }
        }

        return false;
    }

    /**
     * Build all attribute data at once for efficiency
     */
    protected function _buildAllAttributeData()
    {
        $attributes = $this->_attributeCollection->create();
        if ($attributes->getSize()) {
            /* @var $attribute \Gene\BlueFoot\Model\Attribute */
            foreach ($attributes as $attribute) {
                $this->_attributeData[$attribute->getAttributeCode()] = $this->_flattenAttributeData($attribute);
            }
        }
    }

    /**
     * Return the attribute group data
     *
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock
     *
     * @return array
     */
    protected function _getAttributeGroupData(\Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock)
    {
        $groups = $this->_groupCollection->create();
        $groups->setAttributeSetFilter($contentBlock->getId());

        $groupData = [];
        /* @var $group \Magento\Eav\Model\Entity\Attribute\Group */
        foreach ($groups as $group) {
            $attributeCollection = $this->_attributeCollection->create();
            $attributeCollection
                ->setAttributeGroupFilter($group->getId())
                ->setAttributeSetFilter($contentBlock->getId());

            foreach ($attributeCollection->getAllIds() as $attributeId) {
                $groupData[$attributeId] = $group->getAttributeGroupName();
            }
        }

        return $groupData;
    }

    /**
     * Return all fields assigned to a content block
     *
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock
     * @param                                             $groupData
     *
     * @return array
     */
    protected function _getContentBlockFields(\Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock, $groupData)
    {
        $attributes = $contentBlock->getAllAttributes();

        $fields = [];
        /* @var $attribute \Gene\BlueFoot\Model\Attribute */
        foreach ($attributes as $attribute) {
            if ($attributeData = $this->_getAttributeData($attribute)) {
                // Assign the data from the getAttributeData call
                $fields[$attribute->getAttributeCode()] = $attributeData;
                // Assign the group from the group data
                $fields[$attribute->getAttributeCode()]['group'] = isset($groupData[$attribute->getId()]) ?  $groupData[$attribute->getId()] : 'General';
            }
        }

        return $fields;
    }

    /**
     * Retrieve attribute data from the classes built information
     *
     * @param \Gene\BlueFoot\Model\Attribute $attribute
     *
     * @return array
     */
    protected function _getAttributeData(\Gene\BlueFoot\Model\Attribute $attribute)
    {
        if (isset($this->_attributeData[$attribute->getAttributeCode()])) {
            return $this->_attributeData[$attribute->getAttributeCode()];
        }

        return [];
    }

    /**
     * Flatten a single attributes data ready for the stage
     *
     * @param \Gene\BlueFoot\Model\Attribute $attribute
     *
     * @return array
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    protected function _flattenAttributeData(\Gene\BlueFoot\Model\Attribute $attribute)
    {
        $options = [];
        if($attribute->usesSource()){
            $options = $attribute->getSource()->getAllOptions();
        }

        // Assign the type for later manipulation
        $type = $attribute->getFrontend()->getInputType();

        $data = [
            'attribute_id' => $attribute->getId(),
            'code' => $attribute->getAttributeCode(),
            'type' => $type,
            'label' => $attribute->getFrontend()->getLabel(),
            'is_global' => $attribute->getIsGlobal(),
            'group' => 'General'
        ];

        // Only pass options if they aren't empty
        if (!empty($options)) {
            $data['options'] = $options;
        }

        if ($attribute->getNote()) {
            $data['note'] = $attribute->getNote();
        }

        // Pass over if the attribute is required
        if ($attribute->getIsRequired()) {
            $data['required'] = true;
        }

        // Inform the front-end if this field has a data model
        if ($attribute->getData('data_model')) {
            $data['data_model'] = true;
        }

        $childType = false;
        if($type == 'child_entity'){
            if($sourceModel = $attribute->getSource()){
                if(method_exists($sourceModel, 'getAllowedContentBlock')){
                    $childTypeModel = $sourceModel->getAllowedContentBlock();
                    if($childTypeModel){
                        $childType = $childTypeModel->getIdentifier();
                    }
                }
            }
        }

        // Handle different types
        switch($type) {
            case 'boolean':
                $data['type'] = 'select';
                $data['options'] = [
                    ['value' => 0, 'label' => __('No')],
                    ['value' => 1, 'label' => __('Yes')]
                ];
                break;
            case 'multiselect':
                $data['type'] = 'select';
                $data['multiple'] = true;
                break;
            case 'textarea':
                if($attribute->getIsWysiwygEnabled()) {
                    $data['type'] = 'widget';
                    $data['widget'] = 'wysiwyg';
                }
                break;
            case 'image':
            case 'file':
            case 'upload':
                $data['type'] = 'widget';
                $data['widget'] = 'upload';
                break;

            case 'child_entity':
                $data['type'] = 'widget';
                $data['widget'] = 'child_block';
                $data['child_block_type'] = $childType;
                break;

        }

        // If the attribute has a widget assigned to it ensure it renders on the front-end
        if($widget = $attribute->getData('widget')) {
            $data['type'] = 'widget';
            $data['widget'] = $widget;
        }

        return $data;
    }

    /**
     * Send a color theme based on the content types color
     *
     * @param $hex
     *
     * @return string
     */
    protected function _getColorTheme($hex)
    {
        $hex = str_replace('#', '', $hex);
        $r = hexdec(substr($hex,0,2));
        $g = hexdec(substr($hex,2,2));
        $b = hexdec(substr($hex,4,2));

        $contrast = sqrt(
            $r * $r * .241 +
            $g * $g * .691 +
            $b * $b * .068
        );

        if($contrast > 190){
            return 'dark';
        } else {
            return 'light';
        }
    }
}