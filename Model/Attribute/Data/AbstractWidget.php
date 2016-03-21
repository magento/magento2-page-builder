<?php

namespace Gene\BlueFoot\Model\Attribute\Data;

/**
 * Class AbstractWidget
 *
 * @package Gene\BlueFoot\Model\Attribute\Data\Widget
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class AbstractWidget extends \Magento\Framework\Model\AbstractModel
{
    /**
     * Return an array to be parsed as JSON for the page builder system
     *
     * @return array
     */
    public function asJson()
    {
        return [];
    }
}