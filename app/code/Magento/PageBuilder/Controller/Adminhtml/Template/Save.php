<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\Template;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\Api\ImageContentFactory;
use Magento\Framework\Api\ImageContentValidator;
use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Filesystem;
use Magento\MediaStorage\Helper\File\Storage\Database;
use Magento\PageBuilder\Api\Data\TemplateInterface;
use Magento\PageBuilder\Api\TemplateRepositoryInterface;
use Magento\PageBuilder\Model\TemplateFactory;
use Psr\Log\LoggerInterface;
use Magento\Framework\Image\AdapterFactory;
use Magento\PageBuilder\Model\ImageContentUploader;

/**
 * Save a template within template manager
 *
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class Save extends Action implements HttpPostActionInterface
{
    const ADMIN_RESOURCE = 'Magento_PageBuilder::template_save';

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var TemplateFactory
     */
    private $templateFactory;

    /**
     * @var TemplateRepositoryInterface
     */
    private $templateRepository;

    /**
     * @var SearchCriteriaBuilder
     */
    private $searchCriteriaBuilder;

    /**
     * @var Filesystem
     */
    private $filesystem;

    /**
     * @var ImageContentValidator
     * @deprecated
     */
    private $imageContentValidator;

    /**
     * @var ImageContentFactory
     * @deprecated
     */
    private $imageContentFactory;

    /**
     * @var Database
     * @deprecated
     */
    private $mediaStorage;

    /**
     * @var AdapterFactory
     */
    private $imageAdapterFactory;
    
    /**
     * @var ImageContentUploader
     */
    private $contentUploader;

    /**
     * @param Context $context
     * @param LoggerInterface $logger
     * @param TemplateFactory $templateFactory
     * @param TemplateRepositoryInterface $templateRepository
     * @param SearchCriteriaBuilder $searchCriteriaBuilder
     * @param Filesystem $filesystem
     * @param ImageContentValidator $imageContentValidator
     * @param ImageContentFactory $imageContentFactory
     * @param Database $mediaStorage
     * @param AdapterFactory $imageAdapterFactory
     * @param ImageContentUploader|null $contentUploader
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        Context $context,
        LoggerInterface $logger,
        TemplateFactory $templateFactory,
        TemplateRepositoryInterface $templateRepository,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        Filesystem $filesystem,
        ImageContentValidator $imageContentValidator,
        ImageContentFactory $imageContentFactory,
        Database $mediaStorage,
        AdapterFactory $imageAdapterFactory,
        ImageContentUploader $contentUploader = null
    ) {
        parent::__construct($context);

        $this->logger = $logger;
        $this->templateFactory = $templateFactory;
        $this->templateRepository = $templateRepository;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->filesystem = $filesystem;
        $this->imageContentValidator = $imageContentValidator;
        $this->imageContentFactory = $imageContentFactory;
        $this->mediaStorage = $mediaStorage;
        $this->imageAdapterFactory = $imageAdapterFactory;
        $this->contentUploader = $contentUploader ?? ObjectManager::getInstance()->get(ImageContentUploader::class);
    }

    /**
     * Save a template to the database
     *
     * @return \Magento\Framework\App\ResponseInterface|\Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        $request = $this->getRequest();

        try {
            $this->validate($request);
        } catch (LocalizedException $e) {
            return $this->resultFactory->create(ResultFactory::TYPE_JSON)->setData(
                [
                    'status' => 'error',
                    'message' => $e->getMessage()
                ]
            );
        }

        $template = $this->templateFactory->create();
        $template->setName(trim($request->getParam(TemplateInterface::KEY_NAME)));
        $template->setTemplate($request->getParam(TemplateInterface::KEY_TEMPLATE));
        if ($request->getParam('createdFor')) {
            $template->setCreatedFor($request->getParam('createdFor'));
        }

        // If an upload image is provided let's create the image
        if ($request->getParam('previewImage')) {
            try {
                $filePath = $this->storePreviewImage($request);
                // Store the preview image within the new entity
                $template->setPreviewImage($filePath);
            } catch (\Exception $e) {
                $this->logger->critical($e);

                return $this->resultFactory->create(ResultFactory::TYPE_JSON)->setData(
                    [
                        'status' => 'error',
                        'message' => __('Unable to upload image.')
                    ]
                );
            }
        }

        try {
            $this->templateRepository->save($template);

            $result = [
                'status' => 'ok',
                'message' => __('Template was successfully saved.'),
                'data' => $template->toArray()
            ];
        } catch (LocalizedException $e) {
            $result = [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        } catch (\Exception $e) {
            $this->logger->critical($e);

            $result = [
                'status' => 'error'
            ];
        }

        return $this->resultFactory->create(ResultFactory::TYPE_JSON)->setData($result);
    }

    /**
     * Validate the request to ensure the template is valid and should be saved
     *
     * @param RequestInterface $request
     * @throws LocalizedException
     */
    private function validate(RequestInterface $request)
    {
        $name = trim($request->getParam(TemplateInterface::KEY_NAME, ""));
        // If we're missing required data return an error
        if ($name === "" || !$request->getParam(TemplateInterface::KEY_TEMPLATE)) {
            throw new LocalizedException(__('A required field is missing.'));
        }

        // Verify a template of the same name does not already exist
        $searchCriteria = $this->searchCriteriaBuilder
            ->addFilter(TemplateInterface::KEY_NAME, $name)
            ->create();
        $results = $this->templateRepository->getList($searchCriteria);
        if ($results->getTotalCount() > 0) {
            throw new LocalizedException(__('A template with this name already exists.'));
        }
    }

    /**
     * Handle storing the preview image
     *
     * @param RequestInterface $request
     * @return string
     * @throws LocalizedException
     * @throws \Magento\Framework\Exception\FileSystemException
     * @throws \Exception
     */
    private function storePreviewImage(RequestInterface $request) : ?string
    {
        $mediaDir = $this->filesystem
            ->getDirectoryWrite(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
        $fileName = preg_replace("/[^A-Za-z0-9]/", '', str_replace(
            ' ',
            '-',
            strtolower($request->getParam(TemplateInterface::KEY_NAME))
        )) . uniqid() . '.jpg';
        $fileDirectoryPath = $mediaDir->getAbsolutePath('.template-manager');

        // Prepare the image data
        $imgData = str_replace(' ', '+', $request->getParam('previewImage'));
        $imgData = substr($imgData, strpos($imgData, ",") + 1);
        
        $uploadedImage = $this->contentUploader->upload($fileName, $imgData, $fileDirectoryPath);
        $filePath = $fileDirectoryPath . $uploadedImage;
        $relativeFilePath = $mediaDir->getRelativePath($filePath);
        if ($relativeFilePath === null) {
            throw new LocalizedException(__('Unable to retrieve image.'));
        }
        $thumbPath = str_replace('.jpg', '-thumb.jpg', $relativeFilePath);
        $thumbAbsolutePath = $mediaDir->getAbsolutePath() . $thumbPath;
        $imageFactory = $this->imageAdapterFactory->create();
        $imageFactory->open($filePath);
        $imageFactory->resize(350);
        $imageFactory->save($thumbAbsolutePath);

        return $relativeFilePath;
    }
}
