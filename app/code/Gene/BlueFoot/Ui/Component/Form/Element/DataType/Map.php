<?php

namespace Gene\BlueFoot\Ui\Component\Form\Element\DataType;

/**
 * Class Map
 *
 * @package Gene\BlueFoot\Ui\Component\Form\Element\DataType
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Map extends \Magento\Ui\Component\Form\Element\DataType\AbstractDataType
{
    const NAME = 'map';

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
