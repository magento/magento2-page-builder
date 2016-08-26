<?php

namespace Gene\BlueFoot\Ui\Component\Form\Element\DataType;

/**
 * Class Text
 */
class ChildEntity extends \Magento\Ui\Component\Form\Element\DataType\AbstractDataType
{
    const NAME = 'child_entity';

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
