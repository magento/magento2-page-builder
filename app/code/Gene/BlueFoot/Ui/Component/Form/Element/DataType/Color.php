<?php

namespace Gene\BlueFoot\Ui\Component\Form\Element\DataType;

/**
 * Class Color
 *
 * @package Gene\BlueFoot\Ui\Component\Form\Element\DataType
 */
class Color extends \Magento\Ui\Component\Form\Element\DataType\AbstractDataType
{
    const NAME = 'color';

    /**
     * Get component name
     *
     * @return string
     */
    public function getComponentName()
    {
        return static::NAME;
    }
}
