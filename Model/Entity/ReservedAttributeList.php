<?php

namespace Gene\BlueFoot\Model\Entity;

/**
 * Class ReservedAttributeList
 *
 * @package Gene\BlueFoot\Model\Entity
 *
 * @author Dave Macaulay <dave@gene.co.uk>
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
