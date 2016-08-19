<?php

namespace Gene\BlueFoot\Block\Adminhtml\Entity\Attribute\Edit\Tab;

use Magento\Eav\Block\Adminhtml\Attribute\Edit\Main\AbstractMain;

/**
 * Class Main
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\Attribute\Edit\Tab
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Main extends AbstractMain
{
    /**
     * @var \Gene\BlueFoot\Model\WidgetFactory
     */
    protected $_widgetFactory;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory
     */
    protected $_contentBlockCollection;

    /**
     * @param \Magento\Backend\Block\Template\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param \Magento\Framework\Data\FormFactory $formFactory
     * @param \Magento\Eav\Helper\Data $eavData
     * @param \Magento\Config\Model\Config\Source\YesnoFactory $yesnoFactory
     * @param \Magento\Eav\Model\Adminhtml\System\Config\Source\InputtypeFactory $inputTypeFactory
     * @param \Magento\Eav\Block\Adminhtml\Attribute\PropertyLocker $propertyLocker
     * @param array $data
     * @codeCoverageIgnore
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Data\FormFactory $formFactory,
        \Magento\Eav\Helper\Data $eavData,
        \Magento\Config\Model\Config\Source\YesnoFactory $yesnoFactory,
        \Magento\Eav\Model\Adminhtml\System\Config\Source\InputtypeFactory $inputTypeFactory,
        \Magento\Eav\Block\Adminhtml\Attribute\PropertyLocker $propertyLocker,
        \Gene\BlueFoot\Model\WidgetFactory $widgetFactory,
        \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory $contentBlockFactory,
        array $data = []
    ) {
        parent::__construct($context, $registry, $formFactory, $eavData, $yesnoFactory, $inputTypeFactory, $propertyLocker, $data);
        $this->_widgetFactory = $widgetFactory;
        $this->_contentBlockCollection = $contentBlockFactory;
    }

    /**
     * Adding product form elements for editing attribute
     *
     * @return $this
     * @SuppressWarnings(PHPMD.UnusedLocalVariable)
     */
    protected function _prepareForm()
    {
        parent::_prepareForm();

        $attributeObject = $this->getAttributeObject();

        /* @var $form \Magento\Framework\Data\Form */
        $form = $this->getForm();

        /* @var $fieldset \Magento\Framework\Data\Form\Element\Fieldset */
        $fieldset = $form->getElement('base_fieldset');

        // Remove any unneeded fields
        $fieldsToRemove = ['attribute_code', 'is_unique', 'frontend_class', 'is_used_in_grid', 'is_filterable_in_grid'];
        foreach ($fieldset->getElements() as $element) {
            /** @var \Magento\Framework\Data\Form\AbstractForm $element  */
            if (substr($element->getId(), 0, strlen('default_value')) == 'default_value') {
                $fieldsToRemove[] = $element->getId();
            }
        }
        foreach ($fieldsToRemove as $id) {
            $fieldset->removeField($id);
        }

        /* @var $frontendInputElm \Magento\Framework\Data\Form\Element\Select */
        $frontendInputElm = $form->getElement('frontend_input');
        $frontendInputElm->setData('label', __('Input Type'))->setData('title', __('Input Type'));
        $additionalTypes = [
            ['value' => 'child_entity', 'label' => __('Child Entity')],
            ['value' => 'entity_list', 'label' => __('Entity Select')],
        ];

        $response = new \Magento\Framework\DataObject();
        $response->setTypes([]);
        $this->_eventManager->dispatch('adminhtml_bluefoot_entity_attribute_types', ['response' => $response]);
        $_hiddenFields = [];
        foreach ($response->getTypes() as $type) {
            $additionalTypes[] = $type;
            if (isset($type['hide_fields'])) {
                $_hiddenFields[$type['value']] = $type['hide_fields'];
            }
        }
        $this->_coreRegistry->register('attribute_type_hidden_fields', $_hiddenFields);

        $this->_eventManager->dispatch('bluefoot_entity_attribute_form_build_main_tab', ['form' => $form]);

        // Use opt groups for a better layout
        $inputTypeOpts = [
            [
                'label' => __('Basic Fields'),
                'value' => $frontendInputElm->getValues()
            ],
            [
                'label' => __('BlueFoot'),
                'value' => $additionalTypes
            ]
        ];
        $frontendInputElm->setValues($inputTypeOpts);

        // Add the widget field after another
        /* @var $element \Magento\Framework\Data\Form\Element\Select */
        $element = $fieldset->addField(
            'widget',
            'select',
            [
                'name' => 'widget',
                'label' => __('Widget'),
                'title' => __('Widget'),
                'value' => 'text',
                'note' => __('A widget further enhances fields to provide further functionality.'),
                'values' => $this->_widgetFactory->create()->toOptionArray()
            ]
        );
        $fieldset->removeField('widget');
        $fieldset->addElement($element, 'frontend_input');

        /*$element = $fieldset->addField(
            'entity_allowed_content_types',
            'multiselect',
            [
                'name' =>  'additional[entity_allowed_content_types]',
                'label' => __('Content Types'),
                'note' => __('Allowed Content types used for input. Leave empty for all types.'),
                'values' => $contentTypes,
                'value' => $allowedCmsTypes
            ]
        );
        $fieldset->removeField('entity_allowed_content_types');
        $fieldset->addElement($element, 'frontend_input');*/

        $additionalData = $attributeObject->getAdditional();
        $allowedBlockType = (isset($additionalData['entity_allowed_block_type']) ? $additionalData['entity_allowed_block_type'] : false);

        $blockTypesCollection = $this->_contentBlockCollection->create();
        $blockTypes = [];
        foreach ($blockTypesCollection as $blockType) {

            $blockTypes[] = [
                'label' => $blockType->getName() . ' ['.$blockType->getIdentifier().']',
                'value' => $blockType->getId()
            ];
        }

        $element = $fieldset->addField(
            'entity_allowed_block_type',
            'select',
            [
                'name' =>  'additional[entity_allowed_block_type]',
                'label' => __('Block Types'),
                'note' => __('Allowed Content Blocks used for input. Leave empty for all types.'),
                'values' => $blockTypes,
                'value' => $allowedBlockType
            ]
        );
        $fieldset->removeField('entity_allowed_block_type');
        $fieldset->addElement($element, 'frontend_input');

        return $this;
    }

    /**
     * Retrieve additional element types for product attributes
     *
     * @return array
     */
    protected function _getAdditionalElementTypes()
    {
        return ['apply' => 'Magento\Catalog\Block\Adminhtml\Product\Helper\Form\Apply'];
    }
}
