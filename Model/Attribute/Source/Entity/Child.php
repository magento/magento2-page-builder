<?php

namespace Gene\BlueFoot\Model\Attribute\Source\Entity;

/**
 * Class Child
 *
 * @package Gene\BlueFoot\Model\Attribute\Source\Entity
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Child extends \Magento\Eav\Model\Entity\Attribute\Source\AbstractSource
{
    /**
     * @var \Gene\BlueFoot\Model\ContentBlockFactory
     */
    protected $_contentBlock;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory
     */
    protected $_entityCollection;

    protected $_possibleEntities = null;

    /**
     * Child constructor.
     *
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlockFactory          $contentBlockFactory
     * @param \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory $collectionFactory
     */
    public function __construct(
        \Gene\BlueFoot\Model\Attribute\ContentBlockFactory $contentBlockFactory,
        \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory $collectionFactory
    ) {
        $this->_contentBlock = $contentBlockFactory;
        $this->_entityCollection = $collectionFactory;
    }

    /**
     * Return the options available from the source model
     *
     * @return array
     */
    public function getAllOptions()
    {
        if (is_null($this->_options)) {
            $entities = $this->getPossibleEntities();
            $entityValues = array();

            if($entities) {
                /* @var $entity \Gene\BlueFoot\Model\Entity */
                foreach ($entities as $entity) {
                    $label = ($entity->getTitle() ? $entity->getTitle() : '{no title}') . ' [ID: ' . $entity->getId() . ']';
                    $entityValues[] = array('label' => $label, 'value' => $entity->getId());
                }
            }

            $this->_options = $entityValues;
        }

        return $this->_options;
    }

    /**
     * @return array
     */
    public function getOptionArray()
    {
        $_options = array();
        foreach ($this->getAllOptions() as $option) {
            $_options[$option['value']] = $option['label'];
        }
        return $_options;
    }

    /**
     * @param int|string $value
     * @return bool
     */
    public function getOptionText($value)
    {
        $options = $this->getAllOptions();
        foreach ($options as $option) {
            if ($option['value'] == $value) {
                return $option['label'];
            }
        }
        return false;
    }

    /**
     * Get the allowed type of child entities
     *
     * @return $this|bool
     */
    public function getAllowedContentBlock()
    {
        $attribute = $this->getAttribute();
        $additionalData = $attribute->getAdditional();

        $typeId = (isset($additionalData['entity_allowed_block_type']) ? $additionalData['entity_allowed_block_type'] : false);

        if ($typeId) {
            $typeModel = $this->_contentBlock->create()->load($typeId);
            if($typeModel->getId()){
                return $typeModel;
            }
        }

        return false;
    }

    /**
     * Get the possible entities for the field
     *
     * @return array|\Gene\BlueFoot\Model\ResourceModel\Entity\Collection|null
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function getPossibleEntities()
    {
        if(is_null($this->_possibleEntities)) {
            $contentBlock = $this->getAllowedContentBlock();
            if ($contentBlock && $contentBlock->getId()) {
                $entities = $this->_entityCollection->create();
                $entities->addAttributeToSelect('title', 'left');
                $entities->addFieldToFilter('attribute_set_id', array('eq' => $contentBlock->getId()));

                $this->_possibleEntities = $entities;
            } else {
                $this->_possibleEntities = [];
            }
        }

        return $this->_possibleEntities;
    }
}
