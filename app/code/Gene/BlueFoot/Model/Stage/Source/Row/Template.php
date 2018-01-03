<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\Stage\Source\Row;

/**
 * Class Template
 */
class Template extends \Magento\Framework\Model\AbstractModel
{
    /**
     * Return the row template options
     *
     * @return array
     */
    public function toOptionArray()
    {
        return [
            ['label' => 'Full Width', 'value' => 'full-width.phtml'],
            ['label' => 'Default', 'value' => 'default.phtml']
        ];
    }
}
