<?php

namespace Gene\BlueFoot\Ui\Component\Form\Element\DataType;

/**
 * Class Alignment
 * @package Gene\BlueFoot\Ui\Component\Form\Element\DataType
 */
class Alignment extends \Magento\Ui\Component\Form\Element\DataType\AbstractDataType
{
    const NAME = 'alignment';

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
