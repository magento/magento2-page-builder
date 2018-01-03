<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Ui\Component\Listing\Column\Attribute\Required;

use Magento\Framework\Data\OptionSourceInterface;

/**
 * Class Options
 */
class Options implements OptionSourceInterface
{
    /**
     * Get options
     * @return array
     */
    public function toOptionArray()
    {
        return [
            0 => [
                'label' => __('No'),
                'value' => 0
            ],
            1 => [
                'label' => __('Yes'),
                'value' => 1
            ]
        ];
    }
}
