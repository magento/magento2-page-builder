<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Block\Adminhtml\System\Config;

use Magento\Framework\Data\Form\Element\AbstractElement;

/**
 * Class EnableField renders modal window if disable PB in System Configuration
 *
 * @api
 */
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
            "Magento_PageBuilder/js/system/config/enable-field": {"modalTitleText": ' .
            $this->json->serialize($this->getModalTitleText()) . ', "modalContentBody": ' .
            $this->json->serialize($this->getModalContentBody())
            . '}}}</script>';

        $html .= $jsString;
        return $html;
    }

    /**
     * Get text for the modal title heading when user switches to disable
     *
     * @return \Magento\Framework\Phrase
     */
    private function getModalTitleText() : \Magento\Framework\Phrase
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
            'Magento_PageBuilder::system/config/enable_field/modal_content_body.phtml'
        );

        return $this->fetchView($templateFileName);
    }
}
