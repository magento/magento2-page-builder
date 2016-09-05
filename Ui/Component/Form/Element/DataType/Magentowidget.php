<?php

namespace Gene\BlueFoot\Ui\Component\Form\Element\DataType;

/**
 * Class Uploader
 * @package Gene\BlueFoot\Ui\Component\Form\Element\DataType
 */
class Magentowidget extends \Magento\Ui\Component\Form\Element\DataType\AbstractDataType
{
    const NAME = 'magentowidget';

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
