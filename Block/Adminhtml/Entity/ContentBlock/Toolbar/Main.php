<?php

namespace Gene\BlueFoot\Block\Adminhtml\Entity\ContentBlock\Toolbar;

/**
 * Class Main
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\ContentBlock\Toolbar
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Main extends \Magento\Backend\Block\Template
{
    /**
     * @var string
     */
    protected $_template = 'entity/attribute/contentblock/toolbar/main.phtml';

    /**
     * @return $this
     */
    protected function _prepareLayout()
    {
        $this->getToolbar()->addChild(
            'addButton',
            'Magento\Backend\Block\Widget\Button',
            [
                'label' => __('Add Page Builder Block'),
                'onclick' => 'setLocation(\'' . $this->getUrl('bluefoot/*/add') . '\')',
                'class' => 'add primary add-set'
            ]
        );
        return parent::_prepareLayout();
    }

    /**
     * @return string
     */
    public function getNewButtonHtml()
    {
        return $this->getChildHtml('addButton');
    }

    /**
     * @return \Magento\Framework\Phrase
     */
    protected function _getHeader()
    {
        return __('Page Builder Blocks');
    }

    /**
     * @return string
     */
    protected function _toHtml()
    {
        $this->_eventManager->dispatch(
            'adminhtml_bluefoot_entity_contentblock_toolbar_main_html_before',
            ['block' => $this]
        );
        return parent::_toHtml();
    }
}
