<?php

namespace Gene\BlueFoot\Ui\Component\Form\Element\DataType;

/**
 * Class Tags
 *
 * @package Gene\BlueFoot\Ui\Component\Form\Element\DataType
 */
class Tags extends \Magento\Ui\Component\Form\Element\DataType\AbstractDataType
{
    const NAME = 'tags';

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
