<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Block\Adminhtml\System\Config\Form\Field;

/**
 * @api
 */
class GoogleMapsApiKey extends \Magento\Config\Block\System\Config\Form\Field
{
    /**
     * @inheritdoc
     */
    protected function _prepareLayout()
    {
        parent::_prepareLayout();
        $this->setTemplate('Magento_PageBuilder::system/config/google_maps_api_key.phtml');
        return $this;
    }

    /**
     * @inheritdoc
     */
    public function render(\Magento\Framework\Data\Form\Element\AbstractElement $element)
    {
        $element = clone $element;
        $element->unsScope()->unsCanUseWebsiteValue()->unsCanUseDefaultValue();
        return parent::render($element);
    }

    /**
     * @inheritdoc
     */
    protected function _getElementHtml(\Magento\Framework\Data\Form\Element\AbstractElement $element)
    {
        $originalData = $element->getOriginalData();
        $this->addData(
            [
                'button_label' => __($originalData['button_label']),
                'valid_label' => __($originalData['valid_label']),
                'invalid_label' => __($originalData['invalid_label']),
                'source_field' => $originalData['source_field'],
                'html_id' => $element->getHtmlId(),
                'validate_url' => $this->_urlBuilder->getUrl('pagebuilder/googlemaps/validateapi')
            ]
        );

        return $this->_toHtml();
    }
}
