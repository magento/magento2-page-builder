<?php

namespace Gene\BlueFoot\Ui\Component\Form\Element\DataType;

/**
 * Class Video
 *
 * @package Gene\BlueFoot\Ui\Component\Form\Element\DataType
 */
class Video extends \Magento\Ui\Component\Form\Element\DataType\AbstractDataType
{
    const NAME = 'video';

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
