<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Block\Adminhtml\System\Config;

use Magento\Framework\Data\Form\Element\AbstractElement;

class EnableField extends \Magento\Config\Block\System\Config\Form\Field
{
    /**
     * @var \Magento\Framework\Serialize\Serializer\Json
     */
    private $json;

    /**
     * @param \Magento\Backend\Block\Template\Context $context
     * @param \Magento\Framework\Serialize\Serializer\Json $json
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Serialize\Serializer\Json $json,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->json = $json;
    }

    /**
     * {@inheritdoc}
     */
    protected function _getElementHtml(AbstractElement $element)
    {
        $html = parent::_getElementHtml($element);
        $enablePageBuilderSelector = '#cms_pagebuilder_enabled';

        $jsString = '<script type="text/x-magento-init"> {"' .
            $enablePageBuilderSelector . '": {
            "Magento_PageBuilder/js/system/config/enableButton": {"modalTitleText": ' .
            $this->json->serialize($this->getModalTitleText()) . ', "modalContentBody": ' .
            $this->json->serialize($this->getModalContentBody())
            . '}}}</script>';

        $html .= $jsString;
        return $html;
    }

    /**
     * Get text for the modal title heading when user switches to disable
     *
     * @return string
     */
    private function getModalTitleText()
    {
        return __('Are You Sure You Want to Turn Off Page Builder?');
    }

    /**
     * Get HTML for the modal content body when user switches to disable
     *
     * @return string
     */
    private function getModalContentBody()
    {
        $templateFileName = $this->getTemplateFile(
            'Magento_PageBuilder::system/config/enableButton/modalContentBody.phtml'
        );

        return $this->fetchView($templateFileName);
    }
}
