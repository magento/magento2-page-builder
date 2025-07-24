<?php
/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Block\Adminhtml\ContentType\Edit;

use Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface;

/**
 * Save button on edit panel for Content Type
 *
 * @api
 */
class SaveButton implements ButtonProviderInterface
{
    /**
     * Retrieve button data
     *
     * @return array
     */
    public function getButtonData() : array
    {
        return [
            'label' => __('Save'),
            'class' => 'save primary',
            'data_attribute' => [
                'mage-init' => ['button' => ['event' => 'save']],
                'form-role' => 'save',
            ],
            'sort_order' => 30,
        ];
    }
}
