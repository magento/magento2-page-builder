<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Gene\BlueFoot\Block\Adminhtml\ContentType\Edit;

use Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface;

/**
 * Class ResetButton
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\Edit\Button
 */
class ResetButton implements ButtonProviderInterface
{
    /**
     * @var string
     */
    private $targetName;

    /**
     * GenericButton constructor.
     *
     * @param $targetName
     */
    public function __construct($targetName = '')
    {
        $this->targetName = $targetName;
    }

    /**
     * @return array
     */
    public function getButtonData()
    {
        return [
            'label'          => __('Reset'),
            'class'          => 'reset',
            'on_click'       => '',
            'data_attribute' => [
                'mage-init' => [
                    'buttonAdapter' => [
                        'actions' => [
                            [
                                'targetName' => $this->targetName,
                                'actionName' => 'reset',
                                'params'     => [
                                    false,
                                ]
                            ]
                        ]
                    ]
                ],
                'form-role' => 'reset',
            ],
            'sort_order'     => 30
        ];
    }
}
