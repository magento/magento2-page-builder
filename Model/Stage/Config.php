<?php

namespace Gene\BlueFoot\Model\Stage;

use Magento\Framework\Api\SearchCriteriaBuilder;
use Gene\BlueFoot\Api\ContentBlockGroupRepositoryInterface;

/**
 * Class Plugin
 *
 * @package Gene\BlueFoot\Model\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Config extends \Magento\Framework\Model\AbstractModel
{
    const BLUEFOOT_CONFIG_CACHE_KEY = 'bluefoot_config_cache';

    /**
     * @var \Gene\BlueFoot\Model\Stage\Structural
     */
    protected $structural;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory
     */
    protected $contentBlockCollection;

    /**
     * @var \Gene\BlueFoot\Api\ContentBlockGroupRepositoryInterface
     */
    protected $contentBlockGroupRepository;

    /**
     * @var \Magento\Eav\Model\EntityFactory
     */
    protected $eavEntityFactory;

    /**
     * @var \Magento\Eav\Model\ResourceModel\Entity\Attribute\Group\CollectionFactory
     */
    protected $groupCollection;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Attribute\CollectionFactory
     */
    protected $attributeCollection;

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
     * @var \Gene\BlueFoot\Model\ResourceModel\Stage\Template\CollectionFactory
     */
    protected $templateCollection;

    /**
     * @var \Magento\Framework\Api\SearchCriteriaBuilder
     */
    protected $searchCriteriaBuilder;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Entity
     */
    protected $entity;

    /**
     * Config constructor.
     *
     * @param \Magento\Framework\Model\Context                                            $context
     * @param \Magento\Framework\Registry                                                 $registry
     * @param \Gene\BlueFoot\Model\Stage\Structural                                       $structural
     * @param \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory $contentBlockCollectionFactory
     * @param \Gene\BlueFoot\Api\ContentBlockGroupRepositoryInterface                     $contentBlockGroupRepository
     * @param \Magento\Eav\Model\EntityFactory                                            $eavEntityFactory
     * @param \Magento\Eav\Model\ResourceModel\Entity\Attribute\Group\CollectionFactory   $groupCollectionFactory
     * @param \Gene\BlueFoot\Model\ResourceModel\Attribute\CollectionFactory              $attributeCollection
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface                                 $configInterface
     * @param \Magento\Framework\View\LayoutFactory                                       $layoutFactory
     * @param \Gene\BlueFoot\Model\ResourceModel\Stage\Template\CollectionFactory         $templateCollectionFactory
     * @param \Magento\Framework\Api\SearchCriteriaBuilder                                $searchCriteriaBuilder
     * @param \Gene\BlueFoot\Model\ResourceModel\Entity                                   $entity
     * @param \Magento\Framework\App\Cache\StateInterface                                 $cacheState
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null                $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null                          $resourceCollection
     * @param array                                                                       $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Gene\BlueFoot\Model\Stage\Structural $structural,
        \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory $contentBlockCollectionFactory,
        ContentBlockGroupRepositoryInterface $contentBlockGroupRepository,
        \Magento\Eav\Model\EntityFactory $eavEntityFactory,
        \Magento\Eav\Model\ResourceModel\Entity\Attribute\Group\CollectionFactory $groupCollectionFactory,
        \Gene\BlueFoot\Model\ResourceModel\Attribute\CollectionFactory $attributeCollection,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        \Magento\Framework\View\LayoutFactory $layoutFactory,
        \Gene\BlueFoot\Model\ResourceModel\Stage\Template\CollectionFactory $templateCollectionFactory,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        \Gene\BlueFoot\Model\ResourceModel\Entity $entity,
        \Magento\Framework\App\Cache\StateInterface $cacheState,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->cacheManager = $context->getCacheManager();
        $this->cacheState = $cacheState;
        $this->structural = $structural;
        $this->contentBlockCollection = $contentBlockCollectionFactory;
        $this->contentBlockGroupRepository = $contentBlockGroupRepository;
        $this->eavEntityFactory = $eavEntityFactory;
        $this->groupCollection = $groupCollectionFactory;
        $this->attributeCollection = $attributeCollection;
        $this->configInterface = $configInterface;
        $this->layoutFactory = $layoutFactory;
        $this->templateCollection = $templateCollectionFactory;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->entity = $entity;

        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
    }

    /**
     * Return the config for the page builder instance
     *
     * @return array
     */
    public function getConfig()
    {
        // Use the cache to load and save the data
        if ($this->cacheState->isEnabled(\Gene\BlueFoot\Model\Cache\Config::TYPE_IDENTIFIER) &&
            ($config = $this->cacheManager->load(self::BLUEFOOT_CONFIG_CACHE_KEY))
        ) {
            return json_decode($config, true);
        } else {
            $config = [
                'contentTypeGroups' => $this->getContentBlockGroups(),
                'contentTypes'      => $this->getContentBlockData(),
                'structural'        => $this->structural->getStructuralConfig(),
                'templates'         => $this->getTemplateData(),
                'globalFields'      => $this->getGlobalFields()
            ];

            // If the cache is enabled, store the config in the cache
            if ($this->cacheState->isEnabled(\Gene\BlueFoot\Model\Cache\Config::TYPE_IDENTIFIER)) {
                // Store the configuration in the cache for 7 days
                $this->cacheManager->save(
                    json_encode($config),
                    self::BLUEFOOT_CONFIG_CACHE_KEY,
                    [\Gene\BlueFoot\Model\Cache\Config::CACHE_TAG],
                    (60 * 60 * 24 * 7) // Store in cache for 7 days
                );
            }

            return $config;
        }
    }

    /**
     * Retrieve the content block groups
     *
     * @return array
     */
    public function getContentBlockGroups()
    {
        $groups = [];

        /* @var $groupsSearchResults \Magento\Framework\Api\SearchResults */
        $groupsSearchResults = $this->contentBlockGroupRepository->getList($this->searchCriteriaBuilder->create());
        foreach ($groupsSearchResults->getItems() as $group) {
            $groups[$group['id']] = [
                'code' => $group['code'],
                'icon' => $group['icon'],
                'name' => $group['name'],
                'sort' => $group['sort_order']
            ];
        }

        return $groups;
    }

    /**
     * Build up template data
     *
     * @return array
     */
    public function getTemplateData()
    {
        $templates = $this->templateCollection->create();
        $templates->setOrder('pinned', \Magento\Framework\Data\Collection::SORT_ORDER_DESC);

        if ($templates->getSize()) {
            $templateData = array();
            foreach ($templates as $template) {
                $templateData[] = array(
                    'id' => $template->getId(),
                    'name' => $template->getData('name'),
                    'preview' => $template->getData('preview'),
                    'structure' => $template->getData('structure'),
                    'pinned' => (bool) $template->getData('pinned')
                );
            }
            return $templateData;
        }

        return [];
    }

    /**
     * Return any global fields
     *
     * @return mixed
     */
    public function getGlobalFields()
    {
        return $this->configInterface->getGlobalFields();
    }

    /**
     * Build up the content block data
     *
     * @return array
     */
    public function getContentBlockData()
    {
        // Retrieve content blocks
        $contentBlocks = $this->contentBlockCollection->create();
        $contentBlocks->setOrder('entity_type.sort_order', \Magento\Framework\Data\Collection::SORT_ORDER_ASC);
        $contentBlocks->setEntityTypeFilter(
            $this->eavEntityFactory->create()->setType(\Gene\BlueFoot\Model\Entity::ENTITY)->getTypeId()
        );

        // Don't load in the default attribute set
        $contentBlocks->addFieldToFilter('main_table.attribute_set_id', array(
            'neq' => $this->entity->getEntityType()->getDefaultAttributeSetId()
        ));

        $contentBlockData = [];
        /* @var $contentBlock \Gene\BlueFoot\Model\Attribute\ContentBlock */
        foreach ($contentBlocks as $contentBlock) {
            $contentBlockData[$contentBlock->getIdentifier()] = $this->flattenContentBlockData($contentBlock);
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
    protected function flattenContentBlockData(\Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock)
    {
        $this->buildAllAttributeData();

        $fields = $this->getContentBlockFields($contentBlock, $this->getAttributeGroupData($contentBlock));

        $contentBlockData = [
            'code' => $contentBlock->getIdentifier(),
            'name' => $contentBlock->getName(),
            'icon' => '<i class="' . $contentBlock->getIconClass() . '"></i>',
            'color' => '#444',
            'color_theme' => $this->getColorTheme('#444'),
            'contentType' => '',
            'group' => ($contentBlock->getGroupId() ? $contentBlock->getGroupId() : 'general'),
            'fields' => $fields,
            'fields_list' => array_keys($fields),
            'visible' => (bool) $contentBlock->getShowInPageBuilder()
        ];

        // Do we have a preview template for this content block?
        if ($previewTemplate = $this->getPreviewTemplate($contentBlock)) {
            $contentBlockData['preview_template'] = $previewTemplate;
        }

        // Do we have a preview block for this content block?
        if ($previewBlock = $this->getPreviewBlock($contentBlock)) {
            $contentBlockData['preview_block'] = $previewBlock;
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
    protected function getPreviewTemplate(\Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock)
    {
        if ($template = $contentBlock->getItemViewTemplate()) {
            $templatePath = $this->configInterface->getTemplate($template);
            if ($templatePath && isset($templatePath['preview'])) {
                return $templatePath['preview'];
            }
        }

        return false;
    }

    /**
     * Get the preview's block for the content block
     *
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock
     *
     * @return bool
     */
    protected function getPreviewBlock(\Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock)
    {
        if ($template = $contentBlock->getItemViewTemplate()) {
            $templatePath = $this->configInterface->getTemplate($template);
            if ($templatePath && isset($templatePath['preview_block'])) {
                return $templatePath['preview_block'];
            }
        }

        return false;
    }

    /**
     * Build all attribute data at once for efficiency
     */
    protected function buildAllAttributeData()
    {
        $attributes = $this->attributeCollection->create();
        if ($attributes->getSize()) {
            /* @var $attribute \Gene\BlueFoot\Model\Attribute */
            foreach ($attributes as $attribute) {
                $this->attributeData[$attribute->getAttributeCode()] = $this->flattenAttributeData($attribute);
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
    protected function getAttributeGroupData(\Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock)
    {
        $groups = $this->groupCollection->create();
        $groups->setAttributeSetFilter($contentBlock->getId());

        $groupData = [];
        /* @var $group \Magento\Eav\Model\Entity\Attribute\Group */
        foreach ($groups as $group) {
            $attributeCollection = $this->attributeCollection->create();
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
    protected function getContentBlockFields(\Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock, $groupData)
    {
        $attributes = $contentBlock->getAllAttributes();
        if ($attributes) {
            $fields = [];
            /* @var $attribute \Gene\BlueFoot\Model\Attribute */
            foreach ($attributes as $attribute) {
                if ($attributeData = $this->getAttributeData($attribute)) {
                    // Assign the data from the getAttributeData call
                    $fields[$attribute->getAttributeCode()] = $attributeData;
                    // Assign the group from the group data
                    $fields[$attribute->getAttributeCode()]['group'] =
                        isset($groupData[$attribute->getId()]) ?  $groupData[$attribute->getId()] : 'General';
                }
            }

            return $fields;
        }

        return [];
    }

    /**
     * Retrieve attribute data from the classes built information
     *
     * @param \Gene\BlueFoot\Model\Attribute $attribute
     *
     * @return array
     */
    protected function getAttributeData(\Gene\BlueFoot\Model\Attribute $attribute)
    {
        if (isset($this->attributeData[$attribute->getAttributeCode()])) {
            return $this->attributeData[$attribute->getAttributeCode()];
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
    protected function flattenAttributeData(\Gene\BlueFoot\Model\Attribute $attribute)
    {
        $options = [];
        if ($attribute->usesSource()) {
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
        if ($type == 'child_entity') {
            if ($sourceModel = $attribute->getSource()) {
                if (method_exists($sourceModel, 'getAllowedContentBlock')) {
                    $childTypeModel = $sourceModel->getAllowedContentBlock();
                    if ($childTypeModel) {
                        $childType = $childTypeModel->getIdentifier();
                    }
                }
            }
        }

        // Handle different types
        switch ($type) {
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
                if ($attribute->getIsWysiwygEnabled()) {
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
        if ($widget = $attribute->getData('widget')) {
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
    protected function getColorTheme($hex)
    {
        $hex = str_replace('#', '', $hex);
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));

        $contrast = sqrt(
            $r * $r * .241 +
            $g * $g * .691 +
            $b * $b * .068
        );

        if ($contrast > 190) {
            return 'dark';
        } else {
            return 'light';
        }
    }
}
