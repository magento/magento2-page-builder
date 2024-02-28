<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Api;

use Magento\Framework\Api\SearchCriteriaInterface;
use Magento\PageBuilder\Api\Data\TemplateInterface;
use Magento\PageBuilder\Api\Data\TemplateSearchResultsInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;

/**
 * @api
 */
interface TemplateRepositoryInterface
{
    /**
     * Save Template
     *
     * @param TemplateInterface $template
     * @return TemplateInterface
     * @throws LocalizedException
     */
    public function save(TemplateInterface $template) : TemplateInterface;

    /**
     * Retrieve Template
     *
     * @param string $templateId
     * @return TemplateInterface
     * @throws LocalizedException
     */
    public function get($templateId) : TemplateInterface;

    /**
     * Retrieve Template matching the specified criteria.
     *
     * @param SearchCriteriaInterface $searchCriteria
     * @return TemplateSearchResultsInterface
     * @throws LocalizedException
     */
    public function getList(SearchCriteriaInterface $searchCriteria);

    /**
     * Delete Template
     *
     * @param TemplateInterface $template
     * @return bool true on success
     * @throws LocalizedException
     */
    public function delete(TemplateInterface $template) : bool;

    /**
     * Delete Template by ID
     *
     * @param string $templateId
     * @return bool true on success
     * @throws NoSuchEntityException
     * @throws LocalizedException
     */
    public function deleteById($templateId) : bool;
}
