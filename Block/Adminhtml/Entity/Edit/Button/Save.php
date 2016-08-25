<?php
/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Block\Adminhtml\Entity\Edit\Button;

use Magento\Ui\Component\Control\Container;

/**
 * Class Save
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\Edit\Button
 *
 * @author Dave Macaulay <dave@gene.co.uk>
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
                                'targetName' => 'bluefoot_edit.bluefoot_edit_form',
                                'actionName' => 'save',
                                'params' => [
                                    false,
                                    true
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
            'label' => __('Save'),
            'data_attribute' => [
                'mage-init' => [
                    'buttonAdapter' => [
                        'actions' => [
                            [
                                'targetName' => 'bluefoot_edit.bluefoot_edit_form',
                                'actionName' => 'save',
                                'params' => [
                                    false,
                                    false
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
