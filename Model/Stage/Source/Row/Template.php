<?php

namespace Gene\BlueFoot\Model\Stage\Source\Row;

/**
 * Class Template
 *
 * @package Gene\BlueFoot\Model\Stage\Source\Row
 *
 * @author  Dave Macaulay <dave@gene.co.uk>
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