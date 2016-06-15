<?php

namespace Gene\BlueFoot\Api;

/**
 * Interface ContentBlockRepositoryInterface
 *
 * @package Gene\BlueFoot\Api
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
interface ContentBlockRepositoryInterface
{
    /**
     * Save content block
     *
     * @param \Gene\BlueFoot\Api\Data\ContentBlockInterface $contentBlock
     *
     * @return mixed
     */
    public function save(\Gene\BlueFoot\Api\Data\ContentBlockInterface $contentBlock);

    /**
     * Retrieve a content block via it's identifier
     *
     * @param $contentBlockIdentifier
     *
     * @return mixed
     */
    public function getByIdentifier($contentBlockIdentifier);

    /**
     * Get a content block by it's ID
     *
     * @param $contentBlockId
     *
     * @return mixed
     */
    public function getById($contentBlockId);

    /**
     * Get a list from a search criteria
     *
     * @param \Magento\Framework\Api\SearchCriteriaInterface $searchCriteria
     *
     * @return mixed
     */
    public function getList(\Magento\Framework\Api\SearchCriteriaInterface $searchCriteria);

    /**
     * Delete content block
     *
     * @param \Gene\BlueFoot\Api\Data\ContentBlockInterface $contentBlock
     *
     * @return mixed
     */
    public function delete(\Gene\BlueFoot\Api\Data\ContentBlockInterface $contentBlock);

    /**
     * Delete a content block
     *
     * @param $contentBlockId
     *
     * @return mixed
     */
    public function deleteById($contentBlockId);
}
