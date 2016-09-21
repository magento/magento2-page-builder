<?php

namespace Gene\BlueFoot\Ui\Component\Form\Element\DataType;

/**
 * Class Align
 *
 * @package Gene\BlueFoot\Ui\Component\Form\Element\DataType
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Metric extends \Magento\Ui\Component\Form\Element\DataType\AbstractDataType
{
    const NAME = 'metric';

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
