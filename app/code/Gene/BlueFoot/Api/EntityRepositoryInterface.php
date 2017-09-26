<?php

namespace Gene\BlueFoot\Api;

/**
 * Interface EntityRepositoryInterface
 *
 * @package Gene\BlueFoot\Api
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
interface EntityRepositoryInterface
{
    /**
     * Save entity
     *
     * @param \Gene\BlueFoot\Api\Data\EntityInterface $entity
     *
     * @return mixed
     */
    public function save(\Gene\BlueFoot\Api\Data\EntityInterface $entity);

    /**
     * Retrieve a group
     *
     * @param $entityId
     *
     * @return mixed
     */
    public function getById($entityId);

    /**
     * Get a list from a search criteria
     *
     * @param \Magento\Framework\Api\SearchCriteriaInterface $searchCriteria
     *
     * @return mixed
     */
    public function getList(\Magento\Framework\Api\SearchCriteriaInterface $searchCriteria);

    /**
     * Delete an entity
     *
     * @param \Gene\BlueFoot\Api\Data\EntityInterface $entity
     *
     * @return mixed
     */
    public function delete(\Gene\BlueFoot\Api\Data\EntityInterface $entity);

    /**
     * Delete an entity
     *
     * @param $entityId
     *
     * @return mixed
     */
    public function deleteById($entityId);
}
