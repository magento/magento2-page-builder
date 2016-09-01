<?php

namespace Gene\BlueFoot\Ui\Component\Form\Element\DataType;

/**
 * Class Redactor
 * @package Gene\BlueFoot\Ui\Component\Form\Element\DataType
 */
class Redactor extends \Magento\Ui\Component\Form\Element\DataType\AbstractDataType
{
    const NAME = 'redactor';

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
