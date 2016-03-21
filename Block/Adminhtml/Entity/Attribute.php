<?php

namespace Gene\BlueFoot\Block\Adminhtml\Entity;

/**
 * Class Attribute
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Attribute extends \Magento\Backend\Block\Widget\Grid\Container
{
    /**
     * @return void
     */
    protected function _construct()
    {
        $this->_controller = 'adminhtml_entity_attribute';
        $this->_blockGroup = 'Gene_BlueFoot';
        $this->_headerText = __('Content Attributes');
        $this->_addButtonLabel = __('Add New Content Attribute');
        parent::_construct();
    }
}
