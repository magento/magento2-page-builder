<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Block\Adminhtml\ContentType\Edit;

use Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface;

/**
 * Reset button on edit panel for Content Type
 * @api
 */
class ResetButton implements ButtonProviderInterface
{
    /**
     * Retrieve button data
     *
     * @return array
     */
    public function getButtonData() : array
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
