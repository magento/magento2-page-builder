<?php

namespace Gene\BlueFoot\Ui\Component\Form\Element\DataType;

/**
 * Class DesignOption
 *
 * @package Gene\BlueFoot\Ui\Component\Form\Element\DataType
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class DesignOption extends \Magento\Ui\Component\Form\Element\DataType\AbstractDataType
{
    const NAME = 'design_option';

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
