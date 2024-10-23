<?php
/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\Template;

use function preg_replace;
use function str_replace;
use function strpos;
use function strtolower;
use function substr;
use function uniqid;
use Exception;
use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\Api\ImageContent;
use Magento\Framework\Api\ImageContentFactory;
use Magento\Framework\Api\ImageContentValidator;
use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\Exception\FileSystemException;
use Magento\Framework\Exception\InputException;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Filesystem;
use Magento\Framework\Image\AdapterFactory;
use Magento\MediaStorage\Helper\File\Storage\Database;
use Magento\PageBuilder\Api\Data\TemplateInterface;
use Magento\PageBuilder\Api\TemplateRepositoryInterface;
use Magento\PageBuilder\Model\TemplateFactory;
use Psr\Log\LoggerInterface;

/**
 * Save a template within template manager
 *
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class Save extends Action implements HttpPostActionInterface
{
    public const ADMIN_RESOURCE = 'Magento_PageBuilder::template_save';

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
     */
    private $imageContentValidator;

    /**
     * @var ImageContentFactory
     */
    private $imageContentFactory;

    /**
     * @var Database
     */
    private $mediaStorage;

    /**
     * @var AdapterFactory
     */
    private $imageAdapterFactory;

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
        AdapterFactory $imageAdapterFactory
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
            } catch (Exception $e) {
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
        } catch (Exception $e) {
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
     * @return null|string
     * @throws Exception
     * @throws FileSystemException
     * @throws InputException
     * @throws LocalizedException
     */
    private function storePreviewImage(RequestInterface $request): ?string
    {
        $fileName = preg_replace("/[^A-Za-z0-9]/", '', str_replace(
            ' ',
            '-',
            strtolower($request->getParam(TemplateInterface::KEY_NAME))
        )) . uniqid() . '.jpg';

        // Prepare the image data
        $imgData = str_replace(' ', '+', $request->getParam('previewImage'));
        $imgData = substr($imgData, strpos($imgData, ',') + 1);
        // phpcs:ignore Magento2.Functions.DiscouragedFunction
        $decodedImage = base64_decode($imgData);

        $imageProperties = getimagesizefromstring($decodedImage);

        if (!$imageProperties) {
            throw new LocalizedException(__('Unable to get properties from image.'));
        }

        /* @var ImageContent $imageContent */
        $imageContent = $this->imageContentFactory->create();
        $imageContent->setBase64EncodedData($imgData);
        $imageContent->setName($fileName);
        $imageContent->setType($imageProperties['mime']);

        if ($this->imageContentValidator->isValid($imageContent)) {
            $mediaDirWrite = $this->filesystem->getDirectoryWrite(DirectoryList::MEDIA);
            $directory = $mediaDirWrite->getAbsolutePath('.template-manager');
            $mediaDirWrite->create($directory);

            $fileAbsolutePath = $directory . DIRECTORY_SEPARATOR . $fileName;
            // Write the file to the directory
            $mediaDirWrite->getDriver()->filePutContents($fileAbsolutePath, $decodedImage);
            // Generate a thumbnail, called -thumb next to the image for usage in the grid
            $thumbPath = str_replace('.jpg', '-thumb.jpg', $fileName);
            $thumbAbsolutePath = $directory . DIRECTORY_SEPARATOR . $thumbPath;
            $imageFactory = $this->imageAdapterFactory->create();
            $imageFactory->open($fileAbsolutePath);
            $imageFactory->resize(350);
            $imageFactory->save($thumbAbsolutePath);
            $this->mediaStorage->saveFile($fileAbsolutePath);
            $this->mediaStorage->saveFile($thumbAbsolutePath);

            // Store the preview image within the new entity
            return $mediaDirWrite->getRelativePath($fileAbsolutePath);
        }

        return null;
    }
}
