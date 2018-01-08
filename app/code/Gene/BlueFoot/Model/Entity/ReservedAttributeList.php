<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\Entity;

/**
 * Class ReservedAttributeList
 */
class ReservedAttributeList
{
    /**
     * @var string[]
     */
    protected $reservedAttributes;

    /**
     * ReservedAttributeList constructor.
     */
    public function __construct()
    {
        $this->reservedAttributes = [];
    }

    /**
     * Check whether attribute reserved or not
     *
     * @param \Magento\Catalog\Model\Entity\Attribute $attribute
     * @return boolean
     */
    public function isReservedAttribute($attribute)
    {
        return in_array($attribute->getAttributeCode(), $this->reservedAttributes);
    }
}
