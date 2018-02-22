<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\Model\Eav\Attribute;

class Presentation
{
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
        if ($inputType === 'textarea' && $attribute->getIsWysiwygEnabled() && $attribute->getIsPagebuilderEnabled()) {
            $attribute->setFrontendInput('pagebuilder');
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
        if ($result['frontend_input'] === 'pagebuilder') {
            $result['is_wysiwyg_enabled'] = 1;
            $result['is_pagebuilder_enabled'] = 1;
            $result['frontend_input'] = 'textarea';
        }
        return $result;
    }
}
