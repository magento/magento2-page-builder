<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Block\Adminhtml\ContentType\Edit;

use Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface;

class ResetButton implements ButtonProviderInterface
{
    /**
     * Retrieve button data
     *
     * @return array
     */
    public function getButtonData()
    {
        return [
            'label' => __('Reset'),
            'class' => 'reset',
            'on_click' => '',
            'data_attribute' => [
                'mage-init' => ['button' => ['event' => 'reset']],
                'form-role' => 'reset',
            ],
            'sort_order' => 30
        ];
    }
}
