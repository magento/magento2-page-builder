<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\Attribute\Data;

/**
 * Class AbstractWidget
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
