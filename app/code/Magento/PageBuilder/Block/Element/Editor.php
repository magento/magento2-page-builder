<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Block\Element;

class Editor extends \Magento\Framework\Data\Form\Element\Editor
{
    /**
     * {@inheritdoc}
     */
    public function getElementHtml()
    {
        if ($this->isPageBuilderUsed()) {
            return '';
        }

        return parent::getElementHtml();
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
            && $config->getData('is_pagebuilder_enabled') !== false;
    }
}
