<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Block\Adminhtml\ContentType\Edit;

use Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface;

/**
 * Close button on edit panel for Content Type
 *
 * @api
 */
class CloseButton implements ButtonProviderInterface
{
    /**
     * @var string
     */
    private $targetName;

    /**
     * Constructor
     *
     * @param $targetName
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
    public function getButtonData() : array
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
                                'targetName' => $this->targetName,
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
            'sort_order' => 90
        ];
    }
}
