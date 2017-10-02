<?php

namespace Gene\BlueFoot\Ui\Component\Form\Element\DataType;

/**
 * Class Align
 *
 * @package Gene\BlueFoot\Ui\Component\Form\Element\DataType
 */
class Align extends \Magento\Ui\Component\Form\Element\DataType\AbstractDataType
{
    const NAME = 'align';

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
