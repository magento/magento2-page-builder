<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Plugin\Eav\System\Config\Source;

/**
 * Plugin for \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype
 */
class InputtypePlugin
{
    /**
     * Append result with additional compatible input types.
     *
     * @param \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype $subject
     * @param array $result
     * @return array
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterToOptionArray(
        \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype $subject,
        array $result
    ){
        $pageBuilderInputType = ['value' => 'pagebuilder', 'label' => __('Magento Page Builder')];
        $result = array_merge($result, [
            $pageBuilderInputType
        ]);
        return $result;
    }
}
