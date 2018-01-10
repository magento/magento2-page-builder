<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Block\Element;

class Editor extends \Magento\Framework\Data\Form\Element\Editor
{
    /**
     * Return HTML button to toggling WYSIWYG
     *
     * @param bool $visible
     * @return string
     */
    protected function _getToggleButtonHtml($visible = true)
    {
        $buttonHtml = '';
        if ($this->getConfig()->getData('pagebuilder_button') !== false) {
            $buttonHtml .= $this->_getButtonHtml(
                [
                    'title' => $this->translate('Enable Advanced CMS'),
                    'class' => 'magento-pagebuilder init-magento-pagebuilder action-default scalable action action-secondary',
                    'id' => 'magento-pagebuilder' . $this->getHtmlId()
                ]
            );
            $buttonHtml .= $this->_getButtonHtml(
                [
                    'title' => $this->translate('Disable Advanced CMS'),
                    'class' => 'magento-pagebuilder disable-magento-pagebuilder',
                    'style' => 'display: none;',
                    'id' => 'disable-magento-pagebuilder' . $this->getHtmlId()
                ]
            );
        }
        return $buttonHtml . parent::_getToggleButtonHtml($visible);
    }

    /**
     * Is the stage aspect of the system enabled
     *
     * @return bool
     */
    protected function isStageEnabled()
    {
        return true;
    }
}
