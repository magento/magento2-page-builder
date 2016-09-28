<?php

namespace Gene\BlueFoot\Block\Adminhtml\Stage\Template\Button;

use Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface;

/**
 * Class SaveButton
 * @package Gene\BlueFoot\Block\Adminhtml\Stage\Template\Button
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */
class SaveButton implements ButtonProviderInterface
{
    /**
     * @return array
     */
    public function getButtonData()
    {
        return [
            'label' => __('Save'),
            'class' => 'save primary',
            'on_click' => false,
            'data_attribute' => [
                'mage-init' => [
                    'buttonAdapter' => [
                        'actions' => [
                            [
                                'targetName' => 'bluefoot_template_create_modal.bluefoot_template_create_modal.modal_form',
                                'actionName' => 'save',
                                'params' => [
                                    false,
                                    true
                                ]
                            ]
                        ]
                    ]
                ],
                'form-role' => 'save',
            ],
            'sort_order' => 10
        ];
    }
}
