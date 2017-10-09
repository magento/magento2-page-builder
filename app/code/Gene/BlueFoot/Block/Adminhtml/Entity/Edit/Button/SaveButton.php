<?php

namespace Gene\BlueFoot\Block\Adminhtml\Entity\Edit\Button;

use Magento\Ui\Component\Control\Container;
use Magento\Framework\Registry;
use Magento\Framework\View\Element\UiComponent\Context;

/**
 * Class SaveButton
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\Edit\Button
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class SaveButton extends Generic
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
                                'targetName' => $this->getTargetName(),
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
                                'targetName' => $this->getTargetName(),
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
