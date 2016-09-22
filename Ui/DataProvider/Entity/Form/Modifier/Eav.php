<?php

namespace Gene\BlueFoot\Ui\DataProvider\Entity\Form\Modifier;

use Gene\BlueFoot\Api\Data\AttributeInterface as BlueFootAttributeInterface;
use Gene\BlueFoot\Api\AttributeGroupRepositoryInterface;
use Gene\BlueFoot\Api\AttributeRepositoryInterface;
use Magento\Catalog\Model\Locator\LocatorInterface;
use Magento\Catalog\Model\ResourceModel\Eav\Attribute as EavAttribute;
use Magento\Catalog\Model\ResourceModel\Eav\AttributeFactory as EavAttributeFactory;
use Magento\Eav\Api\Data\AttributeGroupInterface;
use Magento\Eav\Model\Config;
use Magento\Eav\Model\ResourceModel\Entity\Attribute\Group\CollectionFactory as GroupCollectionFactory;
use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\Api\SortOrderBuilder;
use Magento\Framework\App\Request\DataPersistorInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Filter\Translit;
use Magento\Framework\Stdlib\ArrayManager;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Ui\Component\Form\Field;
use Magento\Ui\Component\Form\Fieldset;
use Magento\Catalog\Ui\DataProvider\CatalogEavValidationRules;
use Magento\Ui\DataProvider\Mapper\FormElement as FormElementMapper;
use Magento\Ui\DataProvider\Mapper\MetaProperties as MetaPropertiesMapper;
use Magento\Catalog\Model\Attribute\ScopeOverriddenValue;
use Gene\BlueFoot\Api\ContentBlockRepositoryInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Gene\BlueFoot\Model\Config\ConfigInterface;
use Magento\Framework\UrlInterface;
use Magento\Framework\Registry;

/**
 * Class Eav
 *
 * @package Gene\BlueFoot\Ui\DataProvider\Entity\Form\Modifier
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Eav extends \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\AbstractModifier
{
    const FORM_NAME = 'bluefoot_form';
    const DATA_SOURCE_DEFAULT = 'entity';
    const DATA_SCOPE = 'data.entity';

    const SORT_ORDER_MULTIPLIER = 10;

    /**
     * @var LocatorInterface
     */
    protected $locator;

    /**
     * @var Config
     */
    protected $eavConfig;

    /**
     * @var CatalogEavValidationRules
     */
    protected $catalogEavValidationRules;

    /**
     * @var RequestInterface
     */
    protected $request;

    /**
     * @var GroupCollectionFactory
     */
    protected $groupCollectionFactory;

    /**
     * @var StoreManagerInterface
     */
    protected $storeManager;

    /**
     * @var FormElementMapper
     */
    protected $formElementMapper;

    /**
     * @var MetaPropertiesMapper
     */
    protected $metaPropertiesMapper;

    /**
     * @var AttributeGroupRepositoryInterface
     */
    protected $attributeGroupRepository;

    /**
     * @var SearchCriteriaBuilder
     */
    protected $searchCriteriaBuilder;

    /**
     * @var AttributeRepositoryInterface
     */
    protected $attributeRepository;

    /**
     * @var SortOrderBuilder
     */
    protected $sortOrderBuilder;

    /**
     * @var EavAttributeFactory
     */
    protected $eavAttributeFactory;

    /**
     * @var Translit
     */
    protected $translitFilter;

    /**
     * @var ArrayManager
     */
    protected $arrayManager;

    /**
     * @var ScopeOverriddenValue
     */
    private $scopeOverriddenValue;

    /**
     * @var array
     */
    private $attributesToDisable;

    /**
     * @var array
     */
    protected $attributesToEliminate;

    /**
     * @var DataPersistorInterface
     */
    protected $dataPersistor;

    /**
     * @var EavAttribute[]
     */
    private $attributes = [];

    /**
     * @var AttributeGroupInterface[]
     */
    private $attributeGroups = [];

    /**
     * @var array
     */
    private $bannedInputTypes = ['media_image'];

    /**
     * @var \Gene\BlueFoot\Model\Attribute\ContentBlockRepository
     */
    private $contentBlockRepository;

    /**
     * @var \Magento\Framework\UrlInterface
     */
    protected $url;

    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    protected $configInterface;

    /**
     * @var \Magento\Framework\Registry
     */
    protected $registry;

    /**
     * Eav constructor.
     *
     * @param \Magento\Catalog\Model\Locator\LocatorInterface                           $locator
     * @param \Magento\Catalog\Ui\DataProvider\CatalogEavValidationRules                $catalogEavValidationRules
     * @param \Magento\Eav\Model\Config                                                 $eavConfig
     * @param \Magento\Framework\App\RequestInterface                                   $request
     * @param \Magento\Eav\Model\ResourceModel\Entity\Attribute\Group\CollectionFactory $groupCollectionFactory
     * @param \Magento\Store\Model\StoreManagerInterface                                $storeManager
     * @param \Magento\Ui\DataProvider\Mapper\FormElement                               $formElementMapper
     * @param \Magento\Ui\DataProvider\Mapper\MetaProperties                            $metaPropertiesMapper
     * @param \Gene\BlueFoot\Api\AttributeGroupRepositoryInterface                      $attributeGroupRepository
     * @param \Gene\BlueFoot\Api\AttributeRepositoryInterface                           $attributeRepository
     * @param \Magento\Framework\Api\SearchCriteriaBuilder                              $searchCriteriaBuilder
     * @param \Magento\Framework\Api\SortOrderBuilder                                   $sortOrderBuilder
     * @param \Magento\Catalog\Model\ResourceModel\Eav\AttributeFactory                 $eavAttributeFactory
     * @param \Magento\Framework\Filter\Translit                                        $translitFilter
     * @param \Magento\Framework\Stdlib\ArrayManager                                    $arrayManager
     * @param \Magento\Catalog\Model\Attribute\ScopeOverriddenValue                     $scopeOverriddenValue
     * @param \Magento\Framework\App\Request\DataPersistorInterface                     $dataPersistor
     * @param \Gene\BlueFoot\Api\ContentBlockRepositoryInterface                        $contentBlockRepositoryInterface
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface                               $configInterface
     * @param \Magento\Framework\UrlInterface                                           $urlInterface
     * @param array                                                                     $attributesToDisable
     * @param array                                                                     $attributesToEliminate
     */
    public function __construct(
        LocatorInterface $locator,
        CatalogEavValidationRules $catalogEavValidationRules,
        Config $eavConfig,
        RequestInterface $request,
        GroupCollectionFactory $groupCollectionFactory,
        StoreManagerInterface $storeManager,
        FormElementMapper $formElementMapper,
        MetaPropertiesMapper $metaPropertiesMapper,
        AttributeGroupRepositoryInterface $attributeGroupRepository,
        AttributeRepositoryInterface $attributeRepository,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        SortOrderBuilder $sortOrderBuilder,
        EavAttributeFactory $eavAttributeFactory,
        Translit $translitFilter,
        ArrayManager $arrayManager,
        ScopeOverriddenValue $scopeOverriddenValue,
        DataPersistorInterface $dataPersistor,
        ContentBlockRepositoryInterface $contentBlockRepositoryInterface,
        ConfigInterface $configInterface,
        UrlInterface $urlInterface,
        Registry $registry,
        $attributesToDisable = [],
        $attributesToEliminate = []
    ) {
        $this->url = $urlInterface;
        $this->locator = $locator;
        $this->catalogEavValidationRules = $catalogEavValidationRules;
        $this->eavConfig = $eavConfig;
        $this->request = $request;
        $this->groupCollectionFactory = $groupCollectionFactory;
        $this->storeManager = $storeManager;
        $this->formElementMapper = $formElementMapper;
        $this->metaPropertiesMapper = $metaPropertiesMapper;
        $this->attributeGroupRepository = $attributeGroupRepository;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->attributeRepository = $attributeRepository;
        $this->sortOrderBuilder = $sortOrderBuilder;
        $this->eavAttributeFactory = $eavAttributeFactory;
        $this->translitFilter = $translitFilter;
        $this->arrayManager = $arrayManager;
        $this->scopeOverriddenValue = $scopeOverriddenValue;
        $this->dataPersistor = $dataPersistor;
        $this->attributesToDisable = $attributesToDisable;
        $this->attributesToEliminate = $attributesToEliminate;
        $this->contentBlockRepositoryInterface = $contentBlockRepositoryInterface;
        $this->configInterface = $configInterface;
        $this->registry = $registry;
    }

    /**
     * {@inheritdoc}
     */
    public function modifyMeta(array $meta)
    {
        $sortOrder = 0;

        if ($this->getAttributeSetId()) {
            foreach ($this->getGroups() as $groupCode => $group) {
                $attributes = !empty($this->getAttributes()[$groupCode]) ? $this->getAttributes()[$groupCode] : [];

                if ($attributes) {
                    $meta[$groupCode]['children'] = $this->getAttributesMeta($attributes, $groupCode);
                    $meta[$groupCode]['arguments']['data']['config']['componentType'] = Fieldset::NAME;
                    $meta[$groupCode]['arguments']['data']['config']['label'] =
                        __('%1', $group->getAttributeGroupName());
                    $meta[$groupCode]['arguments']['data']['config']['collapsible'] = true;
                    $meta[$groupCode]['arguments']['data']['config']['opened'] = ($sortOrder == 0);
                    $meta[$groupCode]['arguments']['data']['config']['dataScope'] = self::DATA_SCOPE;
                    $meta[$groupCode]['arguments']['data']['config']['sortOrder'] =
                        $sortOrder * self::SORT_ORDER_MULTIPLIER;
                }

                $sortOrder++;
            }

            $meta = $this->handleGlobalFields($meta, $sortOrder);
        }

        return $meta;
    }

    /**
     * Add in any extra static global fields
     *
     * @param $meta
     * @param $sortOrder
     *
     * @return mixed
     */
    public function handleGlobalFields($meta, $sortOrder)
    {
        $globalFields = $this->configInterface->getGlobalFields();
        foreach ($globalFields as $globalField) {
            $groupCode = strtolower($globalField['group']);

            // If the group doesn't exist, create it
            if (!isset($meta[$groupCode])) {
                $meta[$groupCode]['arguments']['data']['config']['componentType'] = Fieldset::NAME;
                $meta[$groupCode]['arguments']['data']['config']['label'] =
                    __('%1', $globalField['group']);
                $meta[$groupCode]['arguments']['data']['config']['collapsible'] = true;
                $meta[$groupCode]['arguments']['data']['config']['opened'] = ($sortOrder == 0);
                $meta[$groupCode]['arguments']['data']['config']['dataScope'] = self::DATA_SCOPE;
                $meta[$groupCode]['arguments']['data']['config']['sortOrder'] =
                    $sortOrder * self::SORT_ORDER_MULTIPLIER;

                $sortOrder++;
            }

            // Create our container, alongside our field meta
            $containerMeta = $this->arrayManager->set(
                'arguments/data/config',
                [],
                [
                    'formElement' => 'container',
                    'componentType' => 'container',
                    'breakLine' => false,
                    'label' => $globalField['label'],
                    'required' => (isset($globalField['required']) ? $globalField['required'] : false),
                    'sortOrder' => $sortOrder * self::SORT_ORDER_MULTIPLIER,
                    'scopeLabel' => '',
                ]
            );
            $configPath = ltrim(static::META_CONFIG_PATH, ArrayManager::DEFAULT_PATH_DELIMITER);
            $globalFieldMeta = $this->arrayManager->set($configPath, [], [
                'dataType' => 'text',
                'formElement' => 'input',
                'visible' => true,
                'required' => (isset($globalField['required']) ? $globalField['required'] : false),
                'notice' => (isset($globalField['note']) ? $globalField['note'] : false),
                'default' => (isset($globalField['default']) ? $globalField['default'] : ''),
                'label' => $globalField['label'],
                'code' => $globalField['code'],
                'source' => $groupCode,
                'scopeLabel' => '',
                'globalScope' => false,
                'sortOrder' => $sortOrder * self::SORT_ORDER_MULTIPLIER,
            ]);

            if (!$this->arrayManager->exists($configPath . '/componentType', $globalFieldMeta)) {
                $globalFieldMeta = $this->arrayManager->merge($configPath, $globalFieldMeta, [
                    'componentType' => Field::NAME,
                ]);
            }

            // Inject any widget data
            if ($globalField['type'] == 'widget' && isset($globalField['widget'])) {
                $globalFieldMeta = $this->injectWidgetName($globalField['widget'], $globalFieldMeta);
            }

            // Add our meta field into our container
            $containerMeta['children'][$globalField['code']] = $globalFieldMeta;

            // Add the container as a child of the meta group
            $meta[$groupCode]['children'][] = $containerMeta;
        }

        return $meta;
    }

    /**
     * Get attributes meta
     *
     * @param BlueFootAttributeInterface[] $attributes
     * @param string $groupCode
     * @return array
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    private function getAttributesMeta(array $attributes, $groupCode)
    {
        $meta = [];

        foreach ($attributes as $sortOrder => $attribute) {
            if (in_array($attribute->getFrontendInput(), $this->bannedInputTypes)) {
                continue;
            }

            if (in_array($attribute->getAttributeCode(), $this->attributesToEliminate)) {
                continue;
            }

            if (!($attributeContainer = $this->setupAttributeContainerMeta($attribute))) {
                continue;
            }

            $attributeContainer = $this->addContainerChildren($attributeContainer, $attribute, $groupCode, $sortOrder);

            $meta[static::CONTAINER_PREFIX . $attribute->getAttributeCode()] = $attributeContainer;
        }

        return $meta;
    }

    /**
     * Add container children
     *
     * @param array $attributeContainer
     * @param BlueFootAttributeInterface $attribute
     * @param string $groupCode
     * @param int $sortOrder
     * @return array
     * @api
     */
    public function addContainerChildren(
        array $attributeContainer,
        BlueFootAttributeInterface $attribute,
        $groupCode,
        $sortOrder
    ) {
        foreach ($this->getContainerChildren($attribute, $groupCode, $sortOrder) as $childCode => $child) {
            $attributeContainer['children'][$childCode] = $child;
        }

        $attributeContainer = $this->arrayManager->merge(
            ltrim(static::META_CONFIG_PATH, ArrayManager::DEFAULT_PATH_DELIMITER),
            $attributeContainer,
            [
                'sortOrder' => $sortOrder * self::SORT_ORDER_MULTIPLIER,
                // TODO: Eliminate this in scope of MAGETWO-51364
                'scopeLabel' => $this->getScopeLabel($attribute),
            ]
        );

        return $attributeContainer;
    }

    /**
     * Retrieve container child fields
     *
     * @param BlueFootAttributeInterface $attribute
     * @param string $groupCode
     * @param int $sortOrder
     * @return array
     * @api
     */
    public function getContainerChildren(BlueFootAttributeInterface $attribute, $groupCode, $sortOrder)
    {
        if (!($child = $this->setupAttributeMeta($attribute, $groupCode, $sortOrder))) {
            return [];
        }

        return [$attribute->getAttributeCode() => $child];
    }

    /**
     * The data is currently populated by the JS framework dynamically
     *
     * @param array $data
     *
     * @return array
     */
    public function modifyData(array $data)
    {
        return $data;
    }

    /**
     * Retrieve groups
     *
     * @return AttributeGroupInterface[]
     */
    private function getGroups()
    {
        if (!$this->attributeGroups) {
            $searchCriteria = $this->prepareGroupSearchCriteria()->create();
            $attributeGroupSearchResult = $this->attributeGroupRepository->getList($searchCriteria);
            foreach ($attributeGroupSearchResult->getItems() as $group) {
                $this->attributeGroups[$this->calculateGroupCode($group)] = $group;
            }
        }

        return $this->attributeGroups;
    }

    /**
     * Initialize attribute group search criteria with filters.
     *
     * @return SearchCriteriaBuilder
     */
    private function prepareGroupSearchCriteria()
    {
        return $this->searchCriteriaBuilder->addFilter(
            AttributeGroupInterface::ATTRIBUTE_SET_ID,
            $this->getAttributeSetId()
        );
    }

    /**
     * Return current attribute set id
     *
     * @return int|null
     */
    private function getAttributeSetId()
    {
        // Retrieve the identifier from the registry
        $identifier = $this->registry->registry('bluefoot_edit_identifier');

        try {
            if ($contentBlock = $this->contentBlockRepositoryInterface->getByIdentifier($identifier)) {
                return $contentBlock->getAttributeSetId();
            }
        } catch (NoSuchEntityException $e) {
            return null;
        }

        return null;
    }

    /**
     * Retrieve attributes
     *
     * @return BlueFootAttributeInterface[]
     */
    private function getAttributes()
    {
        if (!$this->attributes) {
            foreach ($this->getGroups() as $group) {
                $this->attributes[$this->calculateGroupCode($group)] = $this->loadAttributes($group);
            }
        }

        return $this->attributes;
    }

    /**
     * Loading product attributes from group
     *
     * @param AttributeGroupInterface $group
     * @return BlueFootAttributeInterface[]
     */
    private function loadAttributes(AttributeGroupInterface $group)
    {
        $attributes = [];
        $sortOrder = $this->sortOrderBuilder
            ->setField('sort_order')
            ->setAscendingDirection()
            ->create();
        $searchCriteria = $this->searchCriteriaBuilder
            ->addFilter(AttributeGroupInterface::GROUP_ID, $group->getAttributeGroupId())
            ->addFilter(BlueFootAttributeInterface::IS_VISIBLE, 1)
            ->addSortOrder($sortOrder)
            ->create();
        $groupAttributes = $this->attributeRepository->getList($searchCriteria)->getItems();
        foreach ($groupAttributes as $attribute) {
            $attributes[] = $attribute;
        }

        return $attributes;
    }

    /**
     * Initial meta setup
     *
     * @param BlueFootAttributeInterface $attribute
     * @param string $groupCode
     * @param int $sortOrder
     * @return array
     * @throws \Magento\Framework\Exception\LocalizedException
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @api
     */
    public function setupAttributeMeta(BlueFootAttributeInterface $attribute, $groupCode, $sortOrder)
    {
        $configPath = ltrim(static::META_CONFIG_PATH, ArrayManager::DEFAULT_PATH_DELIMITER);

        $meta = $this->arrayManager->set($configPath, [], [
            'dataType' => $attribute->getFrontendInput(),
            'formElement' => $this->getFormElementsMapValue($attribute->getFrontendInput()),
            'visible' => $attribute->getIsVisible(),
            'required' => $attribute->getIsRequired(),
            'notice' => $attribute->getNote(),
            'default' => $attribute->getDefaultValue(),
            'label' => $attribute->getDefaultFrontendLabel(),
            'code' => $attribute->getAttributeCode(),
            'source' => $groupCode,
            'scopeLabel' => $this->getScopeLabel($attribute),
            'globalScope' => $this->isScopeGlobal($attribute),
            'sortOrder' => $sortOrder * self::SORT_ORDER_MULTIPLIER,
        ]);

        // TODO: Refactor to $attribute->getOptions() when MAGETWO-48289 is done
        $attributeModel = $this->getAttributeModel($attribute);
        if ($attributeModel->usesSource()) {
            $meta = $this->arrayManager->merge($configPath, $meta, [
                'options' => $attributeModel->getSource()->getAllOptions(),
            ]);
        }

        if (!$this->arrayManager->exists($configPath . '/componentType', $meta)) {
            $meta = $this->arrayManager->merge($configPath, $meta, [
                'componentType' => Field::NAME,
            ]);
        }

        if (in_array($attribute->getAttributeCode(), $this->attributesToDisable)) {
            $meta = $this->arrayManager->merge($configPath, $meta, [
                'disabled' => true,
            ]);
        }

        // TODO: getAttributeModel() should not be used when MAGETWO-48284 is complete
        $childData = $this->arrayManager->get($configPath, $meta, []);
        if (($rules = $this->catalogEavValidationRules->build($this->getAttributeModel($attribute), $childData))) {
            $meta = $this->arrayManager->merge($configPath, $meta, [
                'validation' => $rules,
            ]);
        }

        // Inject additional meta information for the field.
        if ($attribute->getWidget()) {
            $meta = $this->injectWidget($attribute, $meta);
        } else {
            // Generic magento fields
            switch ($attribute->getFrontendInput()) {
                // Core BlueFoot  child entities input
                case 'child_entity':
                    $meta = $this->customizeChildEntity($attribute, $meta);
                    break;

                case 'boolean':
                    $meta = $this->customizeCheckbox($attribute, $meta);
                    break;

                case 'textarea':
                    $meta = $this->customizeWysiwyg($attribute, $meta);
                    break;

                case 'price':
                    $meta = $this->customizePriceAttribute($attribute, $meta);
                    break;

                case 'image':
                    $meta = $this->customizeImage($attribute, $meta);
                    break;

                case 'gallery':
                    // Gallery attribute is being handled by "Images And Videos" section
                    $meta = [];
                    break;
            }
        }

        return $meta;
    }

    /**
     * Setup attribute container meta
     *
     * @param BlueFootAttributeInterface $attribute
     * @return array
     * @api
     */
    public function setupAttributeContainerMeta(BlueFootAttributeInterface $attribute)
    {
        $containerMeta = $this->arrayManager->set(
            'arguments/data/config',
            [],
            [
                'formElement' => 'container',
                'componentType' => 'container',
                'breakLine' => false,
                'label' => $attribute->getDefaultFrontendLabel(),
                'required' => $attribute->getIsRequired(),
            ]
        );

        if ($attribute->getIsWysiwygEnabled()) {
            $containerMeta = $this->arrayManager->merge(
                'arguments/data/config',
                $containerMeta,
                [
                    'component' => 'Magento_Ui/js/form/components/group'
                ]
            );
        }

        return $containerMeta;
    }

    /**
     * Setup attribute data
     *
     * @param BlueFootAttributeInterface $attribute
     * @return mixed|null
     * @api
     */
    public function setupAttributeData(BlueFootAttributeInterface $attribute)
    {
        return null;
    }

    /**
     * BlueFoot widget injection
     *
     * @param \Gene\BlueFoot\Api\Data\AttributeInterface $attribute
     * @param array $meta
     * @return array
     */
    public function injectWidget(BlueFootAttributeInterface $attribute, array $meta)
    {
        // Retrieve the widget name, the widget name is everything before the /
        return $this->injectWidgetName($attribute->getWidget(), $meta);
    }

    /**
     * Inject widget data into meta via a name
     *
     * @param       $widgetName
     * @param array $meta
     *
     * @return array
     */
    protected function injectWidgetName($widgetName, array $meta)
    {
        // Extract the widget from the widget name
        $widget = strtok($widgetName, '/');

        // Handle different widgets
        switch ($widget) {
            case 'search':
                $context = explode('/', $widgetName);
                if (isset($context[1])) {
                    $meta['arguments']['data']['config']['dataType'] ='search';
                    $meta['arguments']['data']['config']['formElement'] ='search';
                    $meta['arguments']['data']['config']['context'] = $context[1];

                    $meta['arguments']['data']['config']['ajaxEndpoint'] = $this->url->getUrl(
                        'bluefoot/stage_widget/search',
                        [
                            'context' => $context[1]
                        ]
                    );
                }
                break;

            case 'magentowidget':
                $meta['arguments']['data']['config']['dataType'] = 'magentowidget';
                $meta['arguments']['data']['config']['formElement'] ='magentowidget';
                break;

            case 'map':
                $meta['arguments']['data']['config']['dataType'] = 'map';
                $meta['arguments']['data']['config']['formElement'] ='map';
                break;

            case 'design_option':
                $meta['arguments']['data']['config']['dataType'] = 'design_option';
                $meta['arguments']['data']['config']['formElement'] ='design_option';
                break;

            case 'align':
                $meta['arguments']['data']['config']['dataType'] = 'align';
                $meta['arguments']['data']['config']['formElement'] ='align';
                break;

            case 'color':
                $meta['arguments']['data']['config']['dataType'] = 'color';
                $meta['arguments']['data']['config']['formElement'] ='color';
                break;

            case 'tags':
                $meta['arguments']['data']['config']['dataType'] = 'tags';
                $meta['arguments']['data']['config']['formElement'] ='tags';
                break;
        }

        return $meta;
    }

    /**
     * BlueFoot child entity input field
     * @param \Gene\BlueFoot\Api\Data\AttributeInterface $attribute
     * @param array $meta
     * @return array
     */
    public function customizeImage(BlueFootAttributeInterface $attribute, array $meta)
    {
        $meta['arguments']['data']['config']['dataType'] = 'uploader';
        $meta['arguments']['data']['config']['formElement'] = 'uploader';

        return $meta;
    }

    /**
     * BlueFoot child entity input field
     * @param \Gene\BlueFoot\Api\Data\AttributeInterface $attribute
     * @param array $meta
     * @return array
     */
    public function customizeChildEntity(BlueFootAttributeInterface $attribute, array $meta)
    {
        $meta['arguments']['data']['config']['dataType'] = 'child_entity';
        $meta['arguments']['data']['config']['formElement'] = 'child_entity';

        return $meta;
    }

    /**
     * Customize checkboxes
     *
     * @param BlueFootAttributeInterface $attribute
     * @param array $meta
     * @return array
     */
    private function customizeCheckbox(BlueFootAttributeInterface $attribute, array $meta)
    {
        if ($attribute->getFrontendInput() === 'boolean') {
            $meta['arguments']['data']['config']['prefer'] = 'toggle';
            $meta['arguments']['data']['config']['valueMap'] = [
                'true' => '1',
                'false' => '0',
            ];
        }

        return $meta;
    }

    /**
     * Customize attribute that has price type
     *
     * @param BlueFootAttributeInterface $attribute
     * @param array $meta
     * @return array
     */
    private function customizePriceAttribute(BlueFootAttributeInterface $attribute, array $meta)
    {
        if ($attribute->getFrontendInput() === 'price') {
            $meta['arguments']['data']['config']['addbefore'] = $this->locator->getStore()
                ->getBaseCurrency()
                ->getCurrencySymbol();
        }

        return $meta;
    }

    /**
     * Add wysiwyg properties
     *
     * @param BlueFootAttributeInterface $attribute
     * @param array $meta
     * @return array
     */
    private function customizeWysiwyg(BlueFootAttributeInterface $attribute, array $meta)
    {
        if (!$attribute->getIsWysiwygEnabled()) {
            return $meta;
        }

        $meta['arguments']['data']['config']['dataType'] = 'redactor';
        $meta['arguments']['data']['config']['formElement'] = 'redactor';

        return $meta;
    }

    /**
     * Retrieve form element
     *
     * @param string $value
     * @return mixed
     */
    private function getFormElementsMapValue($value)
    {
        $valueMap = $this->formElementMapper->getMappings();

        return isset($valueMap[$value]) ? $valueMap[$value] : $value;
    }

    /**
     * Retrieve scope label
     *
     * @param BlueFootAttributeInterface $attribute
     * @return \Magento\Framework\Phrase|string
     */
    private function getScopeLabel(BlueFootAttributeInterface $attribute)
    {
        return '';
    }

    /**
     * Check if attribute scope is global.
     *
     * @param BlueFootAttributeInterface $attribute
     * @return bool
     */
    private function isScopeGlobal($attribute)
    {
        return $attribute->getScope() === BlueFootAttributeInterface::SCOPE_GLOBAL_TEXT;
    }

    /**
     * Load attribute model by attribute data object.
     *
     * TODO: This method should be eliminated when all missing service methods are implemented
     *
     * @param BlueFootAttributeInterface $attribute
     * @return EavAttribute
     */
    private function getAttributeModel($attribute)
    {
        return $this->eavAttributeFactory->create()->load($attribute->getAttributeId());
    }

    /**
     * Calculate group code based on group name.
     *
     * TODO: This logic is copy-pasted from \Magento\Eav\Model\Entity\Attribute\Group::beforeSave
     * TODO: and should be moved to a separate service, which will allow two-way conversion groupName <=> groupCode
     * TODO: Remove after MAGETWO-48290 is complete
     *
     * @param AttributeGroupInterface $group
     * @return string
     */
    private function calculateGroupCode(AttributeGroupInterface $group)
    {
        $attributeGroupCode = $group->getAttributeGroupCode();

        if ($attributeGroupCode === 'images') {
            $attributeGroupCode = 'image-management';
        }

        return $attributeGroupCode;
    }
}
