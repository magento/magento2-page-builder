<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Ui\Component\Listing\Column\Attribute\Widget;

use Magento\Framework\Data\OptionSourceInterface;

/**
 * Class Options
 *
 */
class Options implements OptionSourceInterface
{
    /**
     * @var \Gene\BlueFoot\Model\WidgetFactory
     */
    protected $widgetFactory;

    /**
     * Options constructor.
     * @param \Gene\BlueFoot\Model\WidgetFactory $widgetFactory
     */
    public function __construct(
        \Gene\BlueFoot\Model\WidgetFactory $widgetFactory
    ) {
        $this->widgetFactory = $widgetFactory;
    }

    /**
     * Get options
     * @return array
     */
    public function toOptionArray()
    {
        $optionData = [];
        $options = $this->widgetFactory->create()->toOptionArray();

        foreach ($options as $topLevel) {
            if (is_array($topLevel['value'])) {
                $optionData = array_merge($optionData, $topLevel['value']);
            }
        }

        return $optionData;
    }
}
