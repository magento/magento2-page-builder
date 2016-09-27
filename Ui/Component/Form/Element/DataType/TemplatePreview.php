<?php

namespace Gene\BlueFoot\Ui\Component\Form\Element\DataType;

/**
 * Class Search
 * @package Gene\BlueFoot\Ui\Component\Form\Element\DataType
 */
class TemplatePreview extends \Magento\Ui\Component\Form\Element\DataType\AbstractDataType
{
        const NAME = 'template_preview';

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