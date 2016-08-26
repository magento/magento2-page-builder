<?php

namespace Gene\BlueFoot\Ui\Component\Form\Element\DataType;

/**
 * Class Text
 */
class Search extends \Magento\Ui\Component\Form\Element\DataType\AbstractDataType
{
    const NAME = 'search';

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
