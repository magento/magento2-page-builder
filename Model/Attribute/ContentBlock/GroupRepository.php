<?php

namespace Gene\BlueFoot\Model\Attribute\ContentBlock;

use Gene\BlueFoot\Api\Data;
use Gene\BlueFoot\Api\ContentBlockGroupRepositoryInterface;
use Magento\Framework\Api\DataObjectHelper;
use Magento\Framework\Api\SortOrder;
use Magento\Framework\Exception\CouldNotDeleteException;
use Magento\Framework\Exception\CouldNotSaveException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Reflection\DataObjectProcessor;
use Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\Group as ResourceGroup;
use Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\Group\CollectionFactory as GroupCollectionFactory;

/**
 * Class GroupRepository
 *
 * @package Gene\BlueFoot\Model\Attribute\ContentBlock
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class GroupRepository implements ContentBlockGroupRepositoryInterface
{
    /**
     * @var ResourceGroup
     */
    protected $resource;

    /**
     * @var GroupFactory
     */
    protected $groupFactory;

    /**
     * @var GroupCollectionFactory
     */
    protected $groupCollectionFactory;

    /**
     * @var Data\ContentBlockGroupSearchResultsInterfaceFactory
     */
    protected $searchResultsFactory;

    /**
     * @var DataObjectHelper
     */
    protected $dataObjectHelper;

    /**
     * @var DataObjectProcessor
     */
    protected $dataObjectProcessor;

    /**
     * @var \Gene\BlueFoot\Api\Data\ContentBlockGroupInterfaceFactory
     */
    protected $dataGroupFactory;

    /**
     * GroupRepository constructor.
     *
     * @param \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\Group                   $resource
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlock\GroupFactory                          $groupFactory
     * @param \Gene\BlueFoot\Api\Data\ContentBlockGroupInterfaceFactory                                $dataGroupFactory
     * @param \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\Group\CollectionFactory $groupCollectionFactory
     * @param \Gene\BlueFoot\Api\Data\ContentBlockGroupSearchResultsInterfaceFactory            $searchResultsFactory
     * @param \Magento\Framework\Api\DataObjectHelper                                           $dataObjectHelper
     * @param \Magento\Framework\Reflection\DataObjectProcessor                                 $dataObjectProcessor
     */
    public function __construct(
        ResourceGroup $resource,
        GroupFactory $groupFactory,
        Data\ContentBlockGroupInterfaceFactory $dataGroupFactory,
        GroupCollectionFactory $groupCollectionFactory,
        Data\ContentBlockGroupSearchResultsInterfaceFactory $searchResultsFactory,
        DataObjectHelper $dataObjectHelper,
        DataObjectProcessor $dataObjectProcessor
    ) {
        $this->resource = $resource;
        $this->groupFactory = $groupFactory;
        $this->groupCollectionFactory = $groupCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataGroupFactory = $dataGroupFactory;
        $this->dataObjectProcessor = $dataObjectProcessor;
    }

    /**
     * Save a group
     *
     * @param \Gene\BlueFoot\Api\Data\ContentBlockGroupInterface $group
     *
     * @return mixed
     * @throws \Magento\Framework\Exception\CouldNotSaveException
     */
    public function save(\Gene\BlueFoot\Api\Data\ContentBlockGroupInterface $group)
    {
        try {
            $this->resource->save($group);
        } catch (\Exception $exception) {
            throw new CouldNotSaveException(__(
                'Could not save the group: %1',
                $exception->getMessage()
            ));
        }
        return $group;
    }

    /**
     * Load a group
     *
     * @param $groupId
     *
     * @return \Gene\BlueFoot\Model\Attribute\ContentBlock\Group
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function getById($groupId)
    {
        $group = $this->groupFactory->create();
        $group->load($groupId);
        if (!$group->getId()) {
            throw new NoSuchEntityException(__('Group with id "%1" does not exist.', $groupId));
        }
        return $group;
    }

    /**
     * Load a group by it's code
     *
     * @param $groupCode
     *
     * @return \Gene\BlueFoot\Model\Attribute\ContentBlock\Group
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function getByCode($groupCode)
    {
        $group = $this->groupFactory->create();
        $group->load($groupCode, 'code');
        if (!$group->getId()) {
            throw new NoSuchEntityException(__('Group with code "%1" does not exist.', $groupCode));
        }
        return $group;
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
        $searchResults = $this->searchResultsFactory->create();
        $searchResults->setSearchCriteria($criteria);

        $collection = $this->groupCollectionFactory->create();
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
        $groups = [];
        /** @var Group $groupModel */
        foreach ($collection as $groupModel) {
            $groupData = $this->dataGroupFactory->create();
            $this->dataObjectHelper->populateWithArray(
                $groupData,
                $groupModel->getData(),
                'Gene\BlueFoot\Api\Data\ContentBlockGroupInterface'
            );
            $groups[] = $this->dataObjectProcessor->buildOutputDataArray(
                $groupData,
                'Gene\BlueFoot\Api\Data\ContentBlockGroupInterface'
            );
        }
        $searchResults->setItems($groups);
        return $searchResults;
    }

    /**
     * Delete a group
     *
     * @param \Gene\BlueFoot\Api\Data\ContentBlockGroupInterface $group
     *
     * @return bool
     * @throws \Magento\Framework\Exception\CouldNotDeleteException
     */
    public function delete(\Gene\BlueFoot\Api\Data\ContentBlockGroupInterface $group)
    {
        try {
            $this->resource->delete($group);
        } catch (\Exception $exception) {
            throw new CouldNotDeleteException(__(
                'Could not delete the group: %1',
                $exception->getMessage()
            ));
        }
        return true;
    }

    /**
     * Delete by a group ID
     *
     * @param $groupId
     *
     * @return bool
     * @throws \Magento\Framework\Exception\CouldNotDeleteException
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function deleteById($groupId)
    {
        return $this->delete($this->getById($groupId));
    }
}
