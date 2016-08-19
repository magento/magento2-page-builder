<?php

namespace Gene\BlueFoot\Ui\Component\Listing\Column\Attribute\Required;

use Magento\Framework\Data\OptionSourceInterface;

/**
 * Class Options
 * @package Gene\BlueFoot\Ui\Component\Listing\Column\Attribute\Required
 * @author Aidan Threadgold <aidan@gene.co.uk>
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
