<?php

namespace Gene\BlueFoot\Block\Adminhtml\Entity\Attribute\Edit;

/**
 * Class Tabs
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\Attribute\Edit
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Tabs extends \Magento\Backend\Block\Widget\Tabs
{
    /**
     * @return void
     */
    protected function _construct()
    {
        parent::_construct();
        $this->setId('bluefoot_entity_attribute_tabs');
        $this->setDestElementId('edit_form');
        $this->setTitle(__('Attribute Information'));
    }

    /**
     * @return $this
     */
    protected function _beforeToHtml()
    {
        $this->addTab(
            'main',
            [
                'label' => __('Properties'),
                'title' => __('Properties'),
                'content' => $this->getChildHtml('main'),
                'active' => true
            ]
        );
        $this->addTab(
            'labels',
            [
                'label' => __('Manage Labels'),
                'title' => __('Manage Labels'),
                'content' => $this->getChildHtml('labels')
            ]
        );
//        $this->addTab(
//            'front',
//            [
//                'label' => __('Storefront Properties'),
//                'title' => __('Storefront Properties'),
//                'content' => $this->getChildHtml('front')
//            ]
//        );

        return parent::_beforeToHtml();
    }
}
