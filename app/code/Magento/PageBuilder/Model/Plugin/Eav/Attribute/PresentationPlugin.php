<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Plugin\Eav\Attribute;


class PresentationPlugin
{
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
    ){
        if ($result['frontend_input'] === 'pagebuilder') {
            $result['is_wysiwyg_enabled'] = 1;
            $result['frontend_input'] = 'textarea';
            $result['is_pagebuilder_enabled'] = 1;
        }
        return $result;
    }
}
