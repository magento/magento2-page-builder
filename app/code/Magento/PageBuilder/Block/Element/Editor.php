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
        if ($this->getConfig()->getData('pagebuilder_button') === true && $this->isPageBuilderUsed()) {
            $buttonHtml .= $this->_getButtonHtml(
                [
                    'title' => $this->translate('Edit with Page Builder'),
                    'class' => 'magento-pagebuilder init-magento-pagebuilder action-default scalable action',
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
     * {@inheritdoc}
     */
    public function isEnabled()
    {
        if ($this->isPageBuilderUsed()) {
            return true;
        }
        return parent::isEnabled();
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

    /**
     * {@inheritdoc}
     */
    protected function getInlineJs($jsSetupObject, $forceLoad)
    {
        if ($this->isPageBuilderUsed()) {
            return '';
        }

        return parent::getInlineJs($jsSetupObject, $forceLoad);
    }

    /**
     * Return if page builder will be used instead of wysiwyg editor
     *
     * @return bool
     */
    private function isPageBuilderUsed()
    {
        $config = $this->getConfig();
        return $config->getData('activeEditorPath') === 'Magento_PageBuilder/pageBuilderAdapter'
            && $config->getData('enable_pagebuilder') !== false;
    }
}
