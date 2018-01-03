<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Api;

/**
 * Interface GroupRepositoryInterface
 */
interface ContentBlockGroupRepositoryInterface
{
    /**
     * Save group
     *
     * @param \Gene\BlueFoot\Api\Data\ContentBlockGroupInterface $group
     *
     * @return mixed
     */
    public function save(\Gene\BlueFoot\Api\Data\ContentBlockGroupInterface $group);

    /**
     * Retrieve a group
     *
     * @param $groupId
     *
     * @return mixed
     */
    public function getById($groupId);

    /**
     * @param $groupCode
     *
     * @return mixed
     */
    public function getByCode($groupCode);

    /**
     * Get a list from a search criteria
     *
     * @param \Magento\Framework\Api\SearchCriteriaInterface $searchCriteria
     *
     * @return mixed
     */
    public function getList(\Magento\Framework\Api\SearchCriteriaInterface $searchCriteria);

    /**
     * Delete a content block
     *
     * @param \Gene\BlueFoot\Api\Data\ContentBlockGroupInterface $group
     *
     * @return mixed
     */
    public function delete(\Gene\BlueFoot\Api\Data\ContentBlockGroupInterface $group);

    /**
     * Delete a group
     *
     * @param $groupId
     *
     * @return mixed
     */
    public function deleteById($groupId);
}
