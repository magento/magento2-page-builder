<?php

namespace Gene\BlueFoot\Model\Attribute\Source\Entity;

use Gene\BlueFoot\Api\ContentBlockRepositoryInterface;

/**
 * Class Child
 *
 * @package Gene\BlueFoot\Model\Attribute\Source\Entity
 *
 * @author  Dave Macaulay <dave@gene.co.uk>
 */
class Child extends \Magento\Eav\Model\Entity\Attribute\Source\AbstractSource
{
    /**
     * @var \Gene\BlueFoot\Model\ContentBlockFactory
     */
    protected $contentBlock;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory
     */
    protected $entityCollection;

    /**
     * @var null|array
     */
    protected $possibleEntities = null;

    /**
     * @var \Gene\BlueFoot\Api\ContentBlockRepositoryInterface
     */
    protected $contentBlockRepository;

    /**
     * @var null|array
     */
    protected $options = null;

    /**
     * Child constructor.
     *
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlockFactory          $contentBlockFactory
     * @param \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory $collectionFactory
     * @param \Gene\BlueFoot\Api\ContentBlockRepositoryInterface          $contentBlockRepositoryInterface
     */
    public function __construct(
        \Gene\BlueFoot\Model\Attribute\ContentBlockFactory $contentBlockFactory,
        \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory $collectionFactory,
        ContentBlockRepositoryInterface $contentBlockRepositoryInterface
    ) {
        $this->contentBlock = $contentBlockFactory;
        $this->entityCollection = $collectionFactory;
        $this->contentBlockRepository = $contentBlockRepositoryInterface;
    }

    /**
     * Return the options available from the source model
     *
     * @return array
     */
    public function getAllOptions()
    {
        if ($this->options === null) {
            $entities = $this->getPossibleEntities();
            $entityValues = array();

            if ($entities) {
                /* @var $entity \Gene\BlueFoot\Model\Entity */
                foreach ($entities as $entity) {
                    $label = ($entity->getTitle() ?
                            $entity->getTitle() : '{no title}') . ' [ID: ' . $entity->getId() . ']';
                    $entityValues[] = array('label' => $label, 'value' => $entity->getId());
                }
            }

            $this->options = $entityValues;
        }

        return $this->options;
    }

    /**
     * @return array
     */
    public function getOptionArray()
    {
        $options = array();
        foreach ($this->getAllOptions() as $option) {
            $options[$option['value']] = $option['label'];
        }

        return $options;
    }

    /**
     * @param int|string $value
     *
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

        $typeId = (isset($additionalData['entity_allowed_block_type']) ?
            $additionalData['entity_allowed_block_type'] :
            false);

        if ($typeId) {
            try {
                $typeModel = $this->contentBlockRepository->getById($typeId);
                if ($typeModel->getId()) {
                    return $typeModel;
                }
            } catch (\NoSuchEntityException $e) {
                return false;
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
        if ($this->possibleEntities === null) {
            $contentBlock = $this->getAllowedContentBlock();
            if ($contentBlock && $contentBlock->getId()) {
                $entities = $this->entityCollection->create();
                $entities->addAttributeToSelect('title', 'left');
                $entities->addFieldToFilter('attribute_set_id', array('eq' => $contentBlock->getId()));

                $this->possibleEntities = $entities;
            } else {
                $this->possibleEntities = [];
            }
        }

        return $this->possibleEntities;
    }
}
