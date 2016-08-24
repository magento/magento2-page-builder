<?php
/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Block\Adminhtml\Entity\Edit\Button;

use Magento\Ui\Component\Control\Container;

/**
 * Class Save
 */
class Save extends Generic
{
    /**
     * {@inheritdoc}
     */
    public function getButtonData()
    {
        return [
            'label' => __('Save & Close'),
            'class' => 'save primary',
            'data_attribute' => [
                'mage-init' => [
                    'buttonAdapter' => [
                        'actions' => [
                            [
                                'targetName' => 'bluefoot_edit.contentblock_edit',
                                'actionName' => 'save',
                                'params' => [
                                    false
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            'class_name' => Container::SPLIT_BUTTON,
            'options' => $this->getOptions(),
        ];
    }

    /**
     * Retrieve options
     *
     * @return array
     */
    protected function getOptions()
    {
        $options[] = [
            'id_hard' => 'save',
            'label' => __('Save'),
            'data_attribute' => [
                'mage-init' => [
                    'buttonAdapter' => [
                        'actions' => [
                            [
                                'targetName' => 'bluefoot_edit.contentblock_edit',
                                'actionName' => 'save',
                                'params' => [
                                    true,
                                    [
                                        'back' => 'new'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ],
        ];

        return $options;
    }
}
