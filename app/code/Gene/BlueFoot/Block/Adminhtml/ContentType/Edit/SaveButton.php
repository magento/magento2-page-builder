<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Gene\BlueFoot\Block\Adminhtml\ContentType\Edit;

use Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface;

/**
 * Class SaveButton
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\Edit\Button
 */
class SaveButton implements ButtonProviderInterface
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
            'label'          => __('Save'),
            'class'          => 'save primary',
            'on_click'       => '',
            'data_attribute' => [
                'mage-init' => [
                    'buttonAdapter' => [
                        'actions' => [
                            [
                                'targetName' => $this->targetName,
                                'actionName' => 'save',
                                'params'     => [
                                    false,
                                ]
                            ]
                        ]
                    ]
                ],
                'form-role' => 'save',
            ],
            'sort_order'     => 90,
        ];
    }
}
