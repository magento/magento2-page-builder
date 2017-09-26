<?php

namespace Gene\BlueFoot\Block\Adminhtml\Stage\Template\Button;

use Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface;

/**
 * Class CloseButton
 * @package Gene\BlueFoot\Block\Adminhtml\Stage\Template\Button
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */
class CloseButton implements ButtonProviderInterface
{
    /**
     * @return array
     */
    public function getButtonData()
    {
        return [
            'label' => __('Cancel'),
            'class' => '',
            'on_click' => false,
            'sort_order' => 20,
            'data_attribute' => [
                'mage-init' => [
                    'buttonAdapter' => [
                        'actions' => [
                            [
                                'targetName' => 'bluefoot_template_create_modal.bluefoot_template_create_modal.modal_form',
                                'actionName' => 'close',
                                'params' => [
                                    false,
                                    true
                                ]
                            ]
                        ]
                    ]
                ]
            ],
        ];
    }
}
