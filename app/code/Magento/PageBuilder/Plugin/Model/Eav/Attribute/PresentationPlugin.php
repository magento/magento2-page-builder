<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\Model\Eav\Attribute;

class PresentationPlugin
{
    /**
     * PageBuilder config
     *
     * @var \Magento\PageBuilder\Model\Config
     */
    private $config;

    /**
     * @param \Magento\PageBuilder\Model\Config $config
     */
    public function __construct(\Magento\PageBuilder\Model\Config $config)
    {
        $this->config = $config;
    }

    /**
     * Get input type for presentation layer from stored input type.
     *
     * @param \Magento\Catalog\Model\Product\Attribute\Frontend\Inputtype\Presentation $subject
     * @param \Magento\Catalog\Model\ResourceModel\Eav\Attribute $attribute
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function beforeGetPresentationInputType(
        \Magento\Catalog\Model\Product\Attribute\Frontend\Inputtype\Presentation $subject,
        $attribute
    ) {
        $inputType = $attribute->getFrontendInput();
        if ($inputType === 'textarea' && $attribute->getIsWysiwygEnabled()) {
            if ($attribute->getIsPagebuilderEnabled() && $this->config->isEnabled()) {
                $attribute->setFrontendInput('pagebuilder');
            } else {
                $attribute->setFrontendInput('texteditor');
            }
        }
    }

    /**
     * Convert presentation to storable input type.
     *
     * @param \Magento\Catalog\Model\Product\Attribute\Frontend\Inputtype\Presentation $subject
     * @param array $result
     * @return array
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterConvertPresentationDataToInputType(
        \Magento\Catalog\Model\Product\Attribute\Frontend\Inputtype\Presentation $subject,
        array $result
    ) {
        $result['is_pagebuilder_enabled'] = 0;
        if (isset($result['frontend_input']) && $result['frontend_input'] === 'pagebuilder') {
            $result['is_wysiwyg_enabled'] = 1;
            $result['is_pagebuilder_enabled'] = 1;
            $result['frontend_input'] = 'textarea';
        }
        return $result;
    }
}
