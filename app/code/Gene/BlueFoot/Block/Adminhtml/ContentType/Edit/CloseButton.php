<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Gene\BlueFoot\Block\Adminhtml\ContentType\Edit;

use Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface;

/**
 * Class CloseButton
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\Edit\Button
 */
class CloseButton implements ButtonProviderInterface
{
    /**
     * @return array
     */
    public function getButtonData()
    {
        return [
            'label'          => __('Close'),
            'class'          => 'reset',
            'on_click'       => '',
            'data_attribute' => [
                'mage-init' => [
                    'buttonAdapter' => [
                        'actions' => [
                            [
                                'targetName' => 'bluefoot_modal_form.bluefoot_modal_form.modal',
                                'actionName' => 'closeModal',
                                'params'     => [
                                    false,
                                ]
                            ]
                        ]
                    ]
                ],
                'form-role' => 'close',
            ],
            'sort_order'     => 30
        ];
    }
}
