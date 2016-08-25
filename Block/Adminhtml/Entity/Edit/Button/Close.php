<?php

namespace Gene\BlueFoot\Block\Adminhtml\Entity\Edit\Button;

use Magento\Ui\Component\Control\Container;

/**
 * Class Close
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\Edit\Button
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Close extends Generic
{
    /**
     * {@inheritdoc}
     */
    public function getButtonData()
    {
        return [
            'label' => __('Close'),
            'sort_order' => 10,
            'data_attribute' => [
                'mage-init' => [
                    'buttonAdapter' => [
                        'actions' => [
                            [
                                'targetName' => 'bluefoot_edit.bluefoot_edit_form',
                                'actionName' => 'closeModal',
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
