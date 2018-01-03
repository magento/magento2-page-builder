<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Widget;

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
     * Upload constructor.
     *
     * @param \Magento\Backend\App\Action\Context              $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     * @param \Gene\BlueFoot\Helper\Config                     $configHelper
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Gene\BlueFoot\Helper\Config $configHelper
    ) {
        parent::__construct($context);

        $this->resultJsonFactory = $resultJsonFactory;
        $this->configHelper = $configHelper;
    }

    /**
     * Allow users to upload images to the folder structure
     *
     * @return $this|\Magento\Framework\Controller\Result\Json
     */
    public function execute()
    {
        $fileUploader = new Uploader('file');

        // Set our parameters
        $fileUploader->setFilesDispersion(true);
        $fileUploader->setAllowRenameFiles(true);
        $fileUploader->setAllowedExtensions(['jpeg','jpg','png','bmp','gif','svg']);
        $fileUploader->setAllowCreateFolders(true);

        // Error handling at it's best
        try {
            // Attempt to save the file
            if ($uploaded = $fileUploader->save($this->configHelper->getUploadDir())) {
                // Return a success callback once the file has been uploaded
                return $this->resultJsonFactory->create()->setData([
                    'success' => true,
                    'file' =>  $this->configHelper->getRelativeUploadUrl() . $uploaded['file']
                ]);
            } else {
                throw new \Exception('An unknown error has occurred');
            }
        } catch (\Exception $e) {
            return $this->resultJsonFactory->create()->setData([
                'success' => false,
                'error' => 'Unable to upload file: ' . $e->getMessage()
            ]);
        }
    }
}
