<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Block\Adminhtml\ContentType\Edit;

use Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface;

class CloseButton implements ButtonProviderInterface
{
    /**
     * Retrieve button data
     *
     * @return array
     */
    public function getButtonData()
    {
        return [
            'label' => __('Close'),
            'class' => 'close',
            'on_click' => '',
            'data_attribute' => [
                'mage-init' => [
                    'buttonAdapter' => [
                        'actions' => [
                            [
                                'targetName' => 'pagebuilder_modal_form.pagebuilder_modal_form.modal',
                                'actionName' => 'closeModal',
                                'params' => [
                                    false,
                                ]
                            ]
                        ]
                    ]
                ],
                'form-role' => 'close',
            ],
            'sort_order' => 30
        ];
    }
}
