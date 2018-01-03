<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Ui\Component\Form\Element\DataType;

/**
 * Class Uploader
 */
class Uploader extends \Magento\Ui\Component\Form\Element\DataType\AbstractDataType
{
    const NAME = 'uploader';

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
