<?php

namespace Gene\BlueFoot\Block\Adminhtml\Entity\ContentBlock\Toolbar;

use Magento\Framework\View\Element\AbstractBlock;

/**
 * Class Add
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\ContentBlock\Toolbar
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Add extends \Magento\Backend\Block\Template
{
    /**
     * @var string
     */
    protected $_template = 'entity/attribute/contentblock/toolbar/add.phtml';

    /**
     * @return AbstractBlock
     */
    protected function _prepareLayout()
    {
        if ($this->getToolbar()) {
            $this->getToolbar()->addChild(
                'save_button',
                'Magento\Backend\Block\Widget\Button',
                [
                    'label' => __('Save'),
                    'class' => 'save primary save-attribute-set',
                    'data_attribute' => [
                        'mage-init' => ['button' => ['event' => 'save', 'target' => '#set-prop-form']],
                    ]
                ]
            );
            $this->getToolbar()->addChild(
                'back_button',
                'Magento\Backend\Block\Widget\Button',
                [
                    'label' => __('Back'),
                    'onclick' => 'setLocation(\'' . $this->getUrl('bluefoot/*/') . '\')',
                    'class' => 'back'
                ]
            );
        }

        $this->addChild('setForm', 'Gene\BlueFoot\Block\Adminhtml\Entity\ContentBlock\Main\Formset');
        return parent::_prepareLayout();
    }

    /**
     * @return \Magento\Framework\Phrase
     */
    protected function _getHeader()
    {
        return __('Add New Page Builder Block');
    }

    /**
     * @return string
     */
    public function getFormHtml()
    {
        return $this->getChildHtml('setForm');
    }

    /**
     * Return id of form, used by this block
     *
     * @return string
     */
    public function getFormId()
    {
        return $this->getChildBlock('setForm')->getForm()->getId();
    }
}
