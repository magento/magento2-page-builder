<?php

namespace Gene\BlueFoot\Block\Adminhtml\Entity\Edit\Button;

use Magento\Ui\Component\Control\Container;

/**
 * Class CloseButton
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\Edit\Button
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class CloseButton extends Generic
{
    /**
     * {@inheritdoc}
     */
    public function getButtonData()
    {
        return [
            'label' => __('Close'),
            'sort_order' => 10,
            'on_click' => false,
            'data_attribute' => [
                'mage-init' => [
                    'buttonAdapter' => [
                        'actions' => [
                            [
                                'targetName' => $this->getTargetName(),
                                'actionName' => 'close',
                                'params' => [
                                    false
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];
    }

}
