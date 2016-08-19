<?php

namespace Gene\BlueFoot\Model\Attribute\Data;

/**
 * Class AbstractWidget
 *
 * @package Gene\BlueFoot\Model\Attribute\Data\Widget
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class AbstractWidget extends \Magento\Framework\Model\AbstractModel implements WidgetInterface
{
    /**
     * Return the entity
     *
     * @return \Gene\BlueFoot\Model\Entity
     */
    public function getEntity()
    {
        return $this->getData(self::ENTITY);
    }

    /**
     * Return the attribute
     *
     * @return \Gene\BlueFoot\Model\Attribute
     */
    public function getAttribute()
    {
        return $this->getData(self::ATTRIBUTE);
    }

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
