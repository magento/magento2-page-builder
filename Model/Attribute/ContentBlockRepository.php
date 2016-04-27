<?php

namespace Gene\BlueFoot\Model\Attribute;

use Gene\BlueFoot\Api\ContentBlockRepositoryInterface;
use Gene\BlueFoot\Api\Data\ContentBlockInterface;
use Magento\Eav\Model\Config as EavConfig;
use Gene\BlueFoot\Model\Attribute\ContentBlock as ContentBlock;
use Gene\BlueFoot\Model\Attribute\ContentBlockFactory as ContentBlockFactory;
use Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock as ContentBlockResource;
use Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory;
use Magento\Framework\Exception\CouldNotDeleteException;
use Magento\Framework\Exception\CouldNotSaveException;
use Magento\Framework\Exception\NoSuchEntityException;

/**
 * Class ContentBlockRepository
 *
 * @package Gene\BlueFoot\Model\Attribute
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class ContentBlockRepository implements ContentBlockRepositoryInterface
{
    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock
     */
    private $_contentBlockResource;

    /**
     * @var \Gene\BlueFoot\Model\Attribute\ContentBlockFactory
     */
    private $_contentBlockFactory;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory
     */
    private $_collectionFactory;

    /**
     * @var EavConfig
     */
    private $_eavConfig;

    /**
     * @var \Magento\Eav\Api\Data\AttributeSetSearchResultsInterfaceFactory
     */
    private $_searchResultsFactory;

    /**
     * @var \Magento\Framework\Api\ExtensionAttribute\JoinProcessorInterface
     */
    protected $_joinProcessor;

    /**
     * ContentBlockRepository constructor.
     *
     * @param \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock                   $contentBlockResource
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlockFactory                          $contentBlockFactory
     * @param \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory $collectionFactory
     * @param \Magento\Eav\Model\Config                                                   $eavConfig
     * @param \Magento\Eav\Api\Data\AttributeSetSearchResultsInterfaceFactory             $searchResultFactory
     * @param \Magento\Framework\Api\ExtensionAttribute\JoinProcessorInterface            $joinProcessor
     */
    public function __construct(
        ContentBlockResource $contentBlockResource,
        ContentBlockFactory $contentBlockFactory,
        CollectionFactory $collectionFactory,
        EavConfig $eavConfig,
        \Magento\Eav\Api\Data\AttributeSetSearchResultsInterfaceFactory $searchResultFactory,
        \Magento\Framework\Api\ExtensionAttribute\JoinProcessorInterface $joinProcessor
    ) {
        $this->_contentBlockResource = $contentBlockResource;
        $this->_contentBlockFactory = $contentBlockFactory;
        $this->_collectionFactory = $collectionFactory;
        $this->_eavConfig = $eavConfig;
        $this->_searchResultsFactory = $searchResultFactory;
        $this->_joinProcessor = $joinProcessor;
    }

    /**
     * Save a content block
     *
     * @param \Gene\BlueFoot\Api\Data\ContentBlockInterface $contentBlock
     *
     * @return \Gene\BlueFoot\Api\Data\ContentBlockInterface
     * @throws \Magento\Framework\Exception\CouldNotSaveException
     */
    public function save(ContentBlockInterface $contentBlock)
    {
        try {
            $this->_contentBlockResource->save($contentBlock);
        } catch (\Exception $exception) {
            throw new CouldNotSaveException(__('There was an error saving attribute set.'));
        }
        return $contentBlock;
    }

    /**
     * Return a list of content blocks
     *
     * @param \Magento\Framework\Api\SearchCriteriaInterface $searchCriteria
     *
     * @return \Magento\Eav\Api\Data\AttributeSetSearchResultsInterface
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function getList(\Magento\Framework\Api\SearchCriteriaInterface $searchCriteria)
    {
        /** @var \Magento\Eav\Model\ResourceModel\Entity\Attribute\Set\Collection $collection */
        $collection = $this->_collectionFactory->create();
        $this->_joinProcessor->process($collection);

        /** The only possible/meaningful search criteria for attribute set is entity type code */
        $entityTypeCode = $this->getEntityTypeCode($searchCriteria);

        if ($entityTypeCode !== null) {
            $collection->setEntityTypeFilter($this->_eavConfig->getEntityType($entityTypeCode)->getId());
        }

        $collection->setCurPage($searchCriteria->getCurrentPage());
        $collection->setPageSize($searchCriteria->getPageSize());

        $searchResults = $this->_searchResultsFactory->create();
        $searchResults->setSearchCriteria($searchCriteria);
        $searchResults->setItems($collection->getItems());
        $searchResults->setTotalCount($collection->getSize());
        return $searchResults;
    }

    /**
     * Load a content block by it's identifier
     *
     * @param $contentBlockIdentifier
     *
     * @return \Gene\BlueFoot\Model\Attribute\ContentBlock
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function getByIdentifier($contentBlockIdentifier)
    {
        /** @var ContentBlock $contentBlock */
        $contentBlock = $this->_contentBlockFactory->create();
        $this->_contentBlockResource->load($contentBlock, $contentBlockIdentifier, 'entity_type.identifier');

        if (!$contentBlock->getId()) {
            throw NoSuchEntityException::singleField('identifier', $contentBlockIdentifier);
        }
        return $contentBlock;
    }

    /**
     * Retrieve entity type code from search criteria
     *
     * @param \Magento\Framework\Api\SearchCriteriaInterface $searchCriteria
     * @return null|string
     */
    protected function getEntityTypeCode(\Magento\Framework\Api\SearchCriteriaInterface $searchCriteria)
    {
        foreach ($searchCriteria->getFilterGroups() as $filterGroup) {
            foreach ($filterGroup->getFilters() as $filter) {
                if ($filter->getField() == 'entity_type_code') {
                    return $filter->getValue();
                }
            }
        }
        return null;
    }

    /**
     * Retrieve a content block
     *
     * @param $contentBlockId
     *
     * @return \Gene\BlueFoot\Model\Attribute\ContentBlock
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function get($contentBlockId)
    {
        /** @var ContentBlock $contentBlock */
        $contentBlock = $this->_contentBlockFactory->create();
        $this->_contentBlockResource->load($contentBlock, $contentBlockId);

        if (!$contentBlock->getId()) {
            throw NoSuchEntityException::singleField('id', $contentBlockId);
        }
        return $contentBlock;
    }

    /**
     * Delete a content block
     *
     * @param \Gene\BlueFoot\Api\Data\ContentBlockInterface $contentBlock
     *
     * @return bool
     * @throws \Magento\Framework\Exception\CouldNotDeleteException
     */
    public function delete(ContentBlockInterface $contentBlock)
    {
        try {
            $this->_contentBlockResource->delete($contentBlock);
        } catch (\Magento\Framework\Exception\StateException $exception) {
            throw new CouldNotDeleteException(__('Default content block can not be deleted'));
        } catch (\Exception $exception) {
            throw new CouldNotDeleteException(__('There was an error deleting the content block.'));
        }
        return true;
    }

    /**
     * Delete a content block by ID
     *
     * @param $contentBlockId
     *
     * @return bool
     * @throws \Magento\Framework\Exception\CouldNotDeleteException
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function deleteById($contentBlockId)
    {
        return $this->delete($this->get($contentBlockId));
    }
}
