<?php

namespace Gene\BlueFoot\Model\Attribute\ContentBlock;

use \Magento\Framework\Exception\AlreadyExistsException;

/**
 * Class Build
 *
 * @package Gene\BlueFoot\Model\AttributeSet
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Build
{
    /**
     * @var \Magento\Eav\Model\Entity\Attribute\SetFactory
     */
    protected $_attributeSetFactory;

    /**
     * @var string
     */
    protected $_name;

    /**
     * @var int
     */
    protected $_entityTypeId;

    /**
     * @var int
     */
    protected $_skeletonId;

    /**
     * @param \Magento\Eav\Model\Entity\Attribute\SetFactory $attributeSetFactory
     */
    public function __construct(
        \Magento\Eav\Model\Entity\Attribute\SetFactory  $attributeSetFactory
    ) {
        $this->_attributeSetFactory = $attributeSetFactory;
    }

    /**
     * @param int $entityTypeId
     * @return $this
     */
    public function setEntityTypeId($entityTypeId)
    {
        $this->_entityTypeId = (int)$entityTypeId;
        return $this;
    }

    /**
     * @param int $skeletonId
     * @return $this
     */
    public function setSkeletonId($skeletonId)
    {
        $this->_skeletonId = (int)$skeletonId;
        return $this;
    }

    /**
     * @param string $setName
     * @return $this
     */
    public function setName($setName)
    {
        $this->_name = $setName;
        return $this;
    }

    /**
     * @return \Magento\Eav\Model\Entity\Attribute\Set
     * @throws AlreadyExistsException
     */
    public function getAttributeSet()
    {
        $this->validateParameters();
        /** @var \Magento\Eav\Model\Entity\Attribute\Set $attributeSet */
        $attributeSet = $this->_attributeSetFactory->create();
        $attributeSet->setEntityTypeId($this->_entityTypeId)->load($this->_name, 'attribute_set_name');
        if ($attributeSet->getId()) {
            throw new AlreadyExistsException(__('Attribute Set already exists.'));
        }

        $attributeSet->setAttributeSetName($this->_name)->validate();
        $attributeSet->save();
        $attributeSet->initFromSkeleton($this->_skeletonId)->save();

        return $attributeSet;
    }

    /**
     * @trows \InvalidArgumentException
     * @return void
     */
    protected function validateParameters()
    {
        if (empty($this->_name)) {
            throw new \InvalidArgumentException();
        } elseif (empty($this->_skeletonId)) {
            throw new \InvalidArgumentException();
        } elseif (empty($this->_entityTypeId)) {
            throw new \InvalidArgumentException();
        }
    }
}
