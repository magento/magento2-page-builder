<?php
/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block\Adminhtml\ContentType\Edit;

use Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface;

/**
 * Cancel button on edit panel for Content Type
 *
 * @api
 */
class CancelButton implements ButtonProviderInterface
{
    /**
     * @var string
     */
    private $targetName;

    /**
     * Constructor
     *
     * @param string $targetName
     */
    public function __construct(string $targetName)
    {
        $this->targetName = $targetName;
    }

    /**
     * Retrieve button data
     *
     * @return array
     */
    public function getButtonData(): array
    {
        return [
            'label' => __('Cancel'),
            'class' => 'cancel',
            'on_click' => '',
            'data_attribute' => [
                'mage-init' => [
                    'buttonAdapter' => [
                        'actions' => [
                            [
                                'targetName' => $this->targetName,
                                'actionName' => 'closeModal',
                                'params' => [
                                    false,
                                ]
                            ]
                        ]
                    ]
                ],
                'form-role' => 'cancel',
            ],
            'sort_order' => 90
        ];
    }
}
