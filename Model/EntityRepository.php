<?php

namespace Gene\BlueFoot\Model;

use Gene\BlueFoot\Api\Data;
use Gene\BlueFoot\Api\EntityRepositoryInterface;
use Magento\Framework\Api\DataObjectHelper;
use Magento\Framework\Api\SortOrder;
use Magento\Framework\Exception\CouldNotDeleteException;
use Magento\Framework\Exception\CouldNotSaveException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Reflection\DataObjectProcessor;
use Gene\BlueFoot\Model\ResourceModel\Entity as ResourceEntity;
use Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory as EntityCollectionFactory;

/**
 * Class EntityRepository
 *
 * @package Gene\BlueFoot\Model
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class EntityRepository implements EntityRepositoryInterface
{
    /**
     * @var ResourceEntity
     */
    protected $_resource;

    /**
     * @var \Gene\BlueFoot\Model\EntityFactory
     */
    protected $_entityFactory;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory
     */
    protected $_entityCollectionFactory;

    /**
     * @var Data\ContentBlockGroupSearchResultsInterfaceFactory
     */
    protected $_searchResultsFactory;

    /**
     * @var DataObjectHelper
     */
    protected $_dataObjectHelper;

    /**
     * @var DataObjectProcessor
     */
    protected $_dataObjectProcessor;

    /**
     * @var \Gene\BlueFoot\Api\Data\EntityInterfaceFactory
     */
    protected $_dataEntityFactory;

    /**
     * EntityRepository constructor.
     *
     * @param \Gene\BlueFoot\Model\ResourceModel\Entity                   $resource
     * @param \Gene\BlueFoot\Model\EntityFactory                          $entityFactory
     * @param \Gene\BlueFoot\Api\Data\EntityInterfaceFactory              $dataEntityFactory
     * @param \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory $entityCollectionFactory
     * @param \Gene\BlueFoot\Api\Data\EntitySearchResultsInterfaceFactory $searchResultsFactory
     * @param \Magento\Framework\Api\DataObjectHelper                     $dataObjectHelper
     * @param \Magento\Framework\Reflection\DataObjectProcessor           $dataObjectProcessor
     */
    public function __construct(
        ResourceEntity $resource,
        EntityFactory $entityFactory,
        Data\EntityInterfaceFactory $dataEntityFactory,
        EntityCollectionFactory $entityCollectionFactory,
        Data\EntitySearchResultsInterfaceFactory $searchResultsFactory,
        DataObjectHelper $dataObjectHelper,
        DataObjectProcessor $dataObjectProcessor
    ) {
        $this->_resource = $resource;
        $this->_entityFactory = $entityFactory;
        $this->_entityCollectionFactory = $entityCollectionFactory;
        $this->_searchResultsFactory = $searchResultsFactory;
        $this->_dataObjectHelper = $dataObjectHelper;
        $this->_dataEntityFactory = $dataEntityFactory;
        $this->_dataObjectProcessor = $dataObjectProcessor;
    }

    /**
     * Save an entity
     *
     * @param \Gene\BlueFoot\Api\Data\EntityInterface $entity
     *
     * @return \Gene\BlueFoot\Api\Data\EntityInterface
     * @throws \Magento\Framework\Exception\CouldNotSaveException
     */
    public function save(\Gene\BlueFoot\Api\Data\EntityInterface $entity)
    {
        try {
            $this->_resource->save($entity);
        } catch (\Exception $exception) {
            throw new CouldNotSaveException(__(
                'Could not save the entity: %1',
                $exception->getMessage()
            ));
        }
        return $entity;
    }

    /**
     * Load an entity
     *
     * @param $entityId
     *
     * @return mixed
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function getById($entityId)
    {
        $entity = $this->_entityFactory->create();
        $entity->load($entityId);
        if (!$entity->getId()) {
            throw new NoSuchEntityException(__('Entity with id "%1" does not exist.', $entityId));
        }
        return $entity;
    }

    /**
     * Load group data from criteria
     *
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     *
     * @return mixed
     */
    public function getList(\Magento\Framework\Api\SearchCriteriaInterface $criteria)
    {
        $searchResults = $this->_searchResultsFactory->create();
        $searchResults->setSearchCriteria($criteria);

        $collection = $this->_entityCollectionFactory->create();
        $collection->addFieldToSelect('*');
        foreach ($criteria->getFilterGroups() as $filterGroup) {
            foreach ($filterGroup->getFilters() as $filter) {
                $condition = $filter->getConditionType() ?: 'eq';
                $collection->addFieldToFilter($filter->getField(), [$condition => $filter->getValue()]);
            }
        }
        $searchResults->setTotalCount($collection->getSize());
        $sortOrders = $criteria->getSortOrders();
        if ($sortOrders) {
            /** @var SortOrder $sortOrder */
            foreach ($sortOrders as $sortOrder) {
                $collection->addOrder(
                    $sortOrder->getField(),
                    ($sortOrder->getDirection() == SortOrder::SORT_ASC) ? 'ASC' : 'DESC'
                );
            }
        }
        $collection->setCurPage($criteria->getCurrentPage());
        $collection->setPageSize($criteria->getPageSize());

        $searchResult = $this->_searchResultsFactory->create();
        $searchResult->setSearchCriteria($criteria);
        $searchResult->setItems($collection->getItems());
        $searchResult->setTotalCount($collection->getSize());
        return $searchResult;
    }

    /**
     * Delete an entity
     *
     * @param \Gene\BlueFoot\Api\Data\EntityInterface $entity
     *
     * @return bool
     * @throws \Magento\Framework\Exception\CouldNotDeleteException
     */
    public function delete(\Gene\BlueFoot\Api\Data\EntityInterface $entity)
    {
        try {
            $this->_resource->delete($entity);
        } catch (\Exception $exception) {
            throw new CouldNotDeleteException(__(
                'Could not delete the entity: %1',
                $exception->getMessage()
            ));
        }
        return true;
    }

    /**
     * Delete an entity by ID
     *
     * @param $entityId
     *
     * @return bool
     * @throws \Magento\Framework\Exception\CouldNotDeleteException
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function deleteById($entityId)
    {
        return $this->delete($this->getById($entityId));
    }
}
