<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Controller\Adminhtml\ContentType\Image;

use Magento\Framework\Controller\ResultFactory;

/**
 * Class Upload
 */
class Upload extends \Magento\Backend\App\Action
{
    const UPLOAD_DIR = 'wysiwyg' . DIRECTORY_SEPARATOR . 'bluefoot';

    /**
     * @var \Magento\Framework\Filesystem\DirectoryList
     */
    protected $directoryList;

    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    private $resultJsonFactory;

    /**
     * @var \Magento\Framework\File\UploaderFactory
     */
    private $uploaderFactory;

    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    private $storeManager;

    /**
     * Upload constructor.
     *
     * @param \Magento\Backend\App\Action\Context              $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     * @param \Magento\Store\Model\StoreManagerInterface       $storeManager
     * @param \Magento\Framework\File\UploaderFactory          $uploaderFactory
     * @param \Magento\Framework\Filesystem\DirectoryList      $directoryList
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Framework\File\UploaderFactory $uploaderFactory,
        \Magento\Framework\Filesystem\DirectoryList $directoryList
    ) {
        parent::__construct($context);

        $this->resultJsonFactory = $resultJsonFactory;
        $this->storeManager = $storeManager;
        $this->uploaderFactory = $uploaderFactory;
        $this->directoryList = $directoryList;
    }

    /**
     * Retrieve path
     *
     * @param string $path
     * @param string $imageName
     *
     * @return string
     */
    public function getFilePath($path, $imageName)
    {
        return rtrim($path, '/') . '/' . ltrim($imageName, '/');
    }

    /**
     * Allow users to upload images to the folder structure
     *
     * @return \Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        try {
            $fieldName = $this->getRequest()->getParam('param_name');
            $fileUploader = $this->uploaderFactory->create(['fileId' => $fieldName]);

            // Set our parameters
            $fileUploader->setFilesDispersion(true);
            $fileUploader->setAllowRenameFiles(true);
            $fileUploader->setAllowedExtensions(['jpeg','jpg','png','gif']);
            $fileUploader->setAllowCreateFolders(true);

            $result = $fileUploader->save($this->getUploadDir());

            $result['url'] = $this->storeManager->getStore()
                    ->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) .
                $this->getFilePath(self::UPLOAD_DIR, $result['file']);

        } catch (\Exception $e) {
            $result = ['error' => $e->getMessage(), 'errorcode' => $e->getCode()];
        }
        return $this->resultFactory->create(ResultFactory::TYPE_JSON)->setData($result);
    }

    /**
     * Return the upload directory
     *
     * @return string
     */
    private function getUploadDir()
    {
        return $this->directoryList->getPath('media') . DIRECTORY_SEPARATOR . self::UPLOAD_DIR;
    }
}
