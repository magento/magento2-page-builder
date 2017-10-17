<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Controller\Adminhtml\ContentType\Image;

use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\File\Uploader;

/**
 * Class Upload
 */
class Upload extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $resultJsonFactory;

    /**
     * @var \Gene\BlueFoot\Helper\Config
     */
    protected $configHelper;

    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    protected $storeManager;

    /**
     * Upload constructor.
     *
     * @param \Magento\Backend\App\Action\Context              $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     * @param \Gene\BlueFoot\Helper\Config                     $configHelper
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Gene\BlueFoot\Helper\Config $configHelper,
        \Magento\Store\Model\StoreManagerInterface $storeManager
    ) {
        parent::__construct($context);

        $this->resultJsonFactory = $resultJsonFactory;
        $this->configHelper = $configHelper;
        $this->storeManager = $storeManager;
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
     * @return $this|\Magento\Framework\Controller\Result\Json
     */
    public function execute()
    {
        // Error handling at it's best
        try {
            $fileUploader = new Uploader('image');

            // Set our parameters
            $fileUploader->setFilesDispersion(true);
            $fileUploader->setAllowRenameFiles(true);
            $fileUploader->setAllowedExtensions(['jpeg','jpg','png','gif']);
            $fileUploader->setAllowCreateFolders(true);

            $result = $fileUploader->save($this->configHelper->getUploadDir());

            $result['url'] = $this->storeManager
                    ->getStore()
                    ->getBaseUrl(
                        \Magento\Framework\UrlInterface::URL_TYPE_MEDIA
                    ) . $this->getFilePath(\Gene\BlueFoot\Helper\Config::UPLOAD_DIR, $result['file']);

        } catch (\Exception $e) {
            $result = ['error' => $e->getMessage(), 'errorcode' => $e->getCode()];
        }
        return $this->resultFactory->create(ResultFactory::TYPE_JSON)->setData($result);
    }
}
