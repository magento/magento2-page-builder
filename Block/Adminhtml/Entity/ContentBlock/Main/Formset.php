<?php

namespace Gene\BlueFoot\Block\Adminhtml\Entity\ContentBlock\Main;

use Magento\Backend\Block\Widget\Form;

/**
 * Class Formset
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\ContentBlock\Main
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Formset extends \Magento\Backend\Block\Widget\Form\Generic
{
    /**
     * @var \Magento\Eav\Model\Entity\Attribute\SetFactory
     */
    protected $_setFactory;

    /**
     * Formset constructor.
     *
     * @param \Magento\Backend\Block\Template\Context            $context
     * @param \Magento\Framework\Registry                        $registry
     * @param \Magento\Framework\Data\FormFactory                $formFactory
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlockFactory $setFactory
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface        $configInterface
     * @param array                                              $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Data\FormFactory $formFactory,
        \Gene\BlueFoot\Model\Attribute\ContentBlockFactory $setFactory,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        array $data = []
    ) {
        $this->_setFactory = $setFactory;
        $this->_configInterface = $configInterface;
        parent::__construct($context, $registry, $formFactory, $data);
    }

    /**
     * Prepares attribute set form
     *
     * @return void
     */
    protected function _prepareForm()
    {
        $data = $this->_setFactory->create()->load($this->getRequest()->getParam('id'));

        /** @var \Magento\Framework\Data\Form $form */
        $form = $this->_formFactory->create();
        $fieldset = $form->addFieldset('contentblock', ['legend' => __('General Information')]);

        $fieldset->addField(
            'attribute_set_name',
            'text',
            [
                'label' => __('Name'),
                'note' => __('The name for your content block, this will be displayed in the page builder'),
                'name' => 'attribute_set_name',
                'required' => true,
                'class' => 'required-entry validate-no-html-tags',
                'value' => $data->getAttributeSetName()
            ]
        );

        $fieldset->addField(
            'identifier',
            'text',
            [
                'label' => __('Identifier'),
                'note' => __('Unique system identifier.<br />Must be all lower case. Must contain no spaces and contain only letters (a-z), numbers (0-9) or underscore(_).'),
                'name' => 'identifier',
                'required' => true,
                'class' => 'required-entry validate-no-html-tags',
                'value' => $data->getIdentifier()
            ]
        );

        $fieldset = $form->addFieldset('contentblock_pagebuilder', ['legend' => __('Page Builder')]);

        $fieldset->addField(
            'show_in_page_builder',
            'select',
            [
                'label' => __('Use In Page Builder?'),
                'note' => __('Should this block be available within the page builder?'),
                'name' => 'show_in_page_builder',
                'options' => [
                    0 => 'No',
                    1 => 'Yes'
                ],
                'value' => $data->getShowInPageBuilder()
            ]
        );

        $fieldset->addField(
            'icon_class',
            'text',
            [
                'label' => __('Icon Class'),
                'note' => __('The class name for the font awesome icon to be displayed within the page builder.<br /><a href="http://fortawesome.github.io/Font-Awesome/icons/" target="_blank">Click here to view icons (opens new tab)</a>'),
                'name' => 'icon_class',
                'required' => true,
                'class' => 'required-entry validate-no-html-tags',
                'value' => $data->getIconClass()
            ]
        );

        $fieldset->addField(
            'color',
            'text',
            [
                'label' => __('Color'),
                'note' => __('The hex color code for this content type, this is used to display the content within the view.'),
                'name' => 'color',
                'required' => true,
                'class' => 'required-entry validate-no-html-tags',
                'value' => $data->getColor()
            ]
        );

        $fieldset = $form->addFieldset('contentblock_design', ['legend' => __('Design')]);

        $fieldset->addField(
            'item_view_template',
            'select',
            [
                'label' => __('Block Template'),
                'name' => 'item_view_template',
                'class' => 'validate-no-html-tags',
                'options' => $this->_getTemplateOptions(),
                'value' => $data->getItemViewTemplate()
            ]
        );

        $fieldset->addField(
            'renderer',
            'select',
            [
                'label' => __('Renderer'),
                'name' => 'renderer',
                'class' => 'validate-no-html-tags',
                'options' => $this->_getRendererOptions(),
                'value' => $data->getRenderer()
            ]
        );

        // If there is no ID force the system to go to the edit page after submission
        if (!$this->getRequest()->getParam('id', false)) {
            $fieldset->addField('gotoEdit', 'hidden', ['name' => 'gotoEdit', 'value' => '1']);
        }

        $form->setMethod('post');
        $form->setUseContainer(true);
        $form->setId('set-prop-form');
        $form->setAction($this->getUrl('bluefoot/*/save'));
        $form->setOnsubmit('return false;');
        $this->setForm($form);
    }

    /**
     * Return the template options
     *
     * @return mixed
     */
    protected function _getTemplateOptions()
    {
        return $this->_toOptionArray($this->_configInterface->getTemplates(), 'file');
    }

    /**
     * Return the renderer options
     *
     * @return mixed
     */
    protected function _getRendererOptions()
    {
        return $this->_toOptionArray($this->_configInterface->getRenderers(), 'class');
    }

    /**
     * Convert an array to be used by the fieldset form
     *
     * @param array $array
     * @param       $fieldValueKey
     *
     * @return array
     */
    protected function _toOptionArray(array $array, $fieldValueKey)
    {
        $optionArray = [
            '' => __('-- Please Select --')
        ];
        foreach ($array as $key => $data) {
            $optionArray[$key] = $data[$fieldValueKey];
        }
        return $optionArray;
    }
}
