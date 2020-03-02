<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model;

use Magento\Framework\Api\SearchCriteria\CollectionProcessorInterface;
use Magento\Framework\Api\SearchCriteriaInterface;
use Magento\Framework\Exception\CouldNotDeleteException;
use Magento\Framework\Exception\CouldNotSaveException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Filesystem;
use Magento\PageBuilder\Api\Data\TemplateInterface;
use Magento\PageBuilder\Api\Data\TemplateSearchResultsInterfaceFactory;
use Magento\PageBuilder\Api\TemplateRepositoryInterface;
use Magento\PageBuilder\Model\ResourceModel\Template as ResourceTemplate;
use Magento\PageBuilder\Model\ResourceModel\Template\CollectionFactory as TemplateCollectionFactory;
use Magento\MediaStorage\Helper\File\Storage\Database;

/**
 * Repository for Page Builder Templates
 *
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class TemplateRepository implements TemplateRepositoryInterface
{
    /**
     * @var ResourceTemplate
     */
    private $resource;

    /**
     * @var TemplateFactory
     */
    private $templateFactory;

    /**
     * @var TemplateCollectionFactory
     */
    private $templateCollectionFactory;

    /**
     * @var TemplateSearchResultsInterfaceFactory
     */
    private $searchResultsFactory;

    /**
     * @var CollectionProcessorInterface
     */
    private $collectionProcessor;

    /**
     * @var Filesystem
     */
    private $filesystem;

    /**
     * @var Database
     */
    private $mediaStorage;

    /**
     * @param ResourceTemplate $resource
     * @param TemplateFactory $templateFactory
     * @param TemplateCollectionFactory $templateCollectionFactory
     * @param TemplateSearchResultsInterfaceFactory $searchResultsFactory
     * @param CollectionProcessorInterface $collectionProcessor
     * @param Filesystem $filesystem
     * @param Database $mediaStorage
     */
    public function __construct(
        ResourceTemplate $resource,
        TemplateFactory $templateFactory,
        TemplateCollectionFactory $templateCollectionFactory,
        TemplateSearchResultsInterfaceFactory $searchResultsFactory,
        CollectionProcessorInterface $collectionProcessor,
        Filesystem $filesystem,
        Database $mediaStorage
    ) {
        $this->resource = $resource;
        $this->templateFactory = $templateFactory;
        $this->templateCollectionFactory = $templateCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->collectionProcessor = $collectionProcessor;
        $this->filesystem = $filesystem;
        $this->mediaStorage = $mediaStorage;
    }

    /**
     * @inheritdoc
     */
    public function save(TemplateInterface $template) : TemplateInterface
    {
        try {
            $this->resource->save($template);
        } catch (\Exception $exception) {
            throw new CouldNotSaveException(
                __('Could not save the template: %1', $exception->getMessage())
            );
        }

        return $this->get($template->getId());
    }

    /**
     * @inheritdoc
     */
    public function get($templateId) : TemplateInterface
    {
        $template = $this->templateFactory->create();
        $this->resource->load($template, $templateId);

        if (!$template->getId()) {
            throw new NoSuchEntityException(__('Template with id "%1" does not exist.', $templateId));
        }

        return $template;
    }

    /**
     * @inheritdoc
     */
    public function getList(SearchCriteriaInterface $criteria)
    {
        $collection = $this->templateCollectionFactory->create();

        $this->collectionProcessor->process($criteria, $collection);

        $searchResults = $this->searchResultsFactory->create();
        $searchResults->setSearchCriteria($criteria);
        $searchResults->setItems($collection->getItems());
        $searchResults->setTotalCount($collection->getSize());
        return $searchResults;
    }

    /**
     * @inheritdoc
     */
    public function delete(TemplateInterface $template) : bool
    {
        $mediaDir = $this->filesystem
            ->getDirectoryWrite(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);

        try {
            $templateModel = $this->templateFactory->create();
            $this->resource->load($templateModel, $template->getTemplateId());
            $this->resource->delete($templateModel);
            $previewImage = $template->getPreviewImage();
            $previewThumbImage = $templateModel->getPreviewThumbnailImage();

            // Remove the preview image from the media directory
            if ($mediaDir->isExist($previewImage)) {
                $mediaDir->delete($previewImage);
            }
            if ($mediaDir->isExist($previewThumbImage)) {
                $mediaDir->delete($previewThumbImage);
            }
            $this->mediaStorage->deleteFile($previewImage);
            $this->mediaStorage->deleteFile($previewThumbImage);
        } catch (\Exception $exception) {
            throw new CouldNotDeleteException(
                __('Could not delete the Template: %1', $exception->getMessage())
            );
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public function deleteById($templateId) : bool
    {
        return $this->delete($this->get($templateId));
    }
}
