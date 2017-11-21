<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Controller\Adminhtml\ContentType;

use Magento\Framework\Controller\ResultFactory;

class Preview extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    private $resultJsonFactory;

    /**
     * @var \Magento\Framework\File\UploaderFactory
     */
    private $uploaderFactory;

    /**
     * @var \Gene\BlueFoot\Helper\Config
     */
    private $configHelper;

    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    private $storeManager;

    /**
     * @var \Gene\BlueFoot\Model\Config
     */
    private $config;

    /**
     * @var \Magento\Framework\View\Element\BlockFactory
     */
    private $blockFactory;

    /**
     * Upload constructor.
     *
     * @param \Magento\Backend\App\Action\Context              $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     * @param \Gene\BlueFoot\Helper\Config                     $configHelper
     * @param \Magento\Store\Model\StoreManagerInterface       $storeManager
     * @param \Magento\Framework\File\UploaderFactory          $uploaderFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Gene\BlueFoot\Helper\Config $configHelper,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Framework\File\UploaderFactory $uploaderFactory,
        \Gene\BlueFoot\Model\Config $config,
        \Magento\Framework\View\Element\BlockFactory $blockFactory
    ) {
        parent::__construct($context);

        $this->resultJsonFactory = $resultJsonFactory;
        $this->configHelper = $configHelper;
        $this->storeManager = $storeManager;
        $this->uploaderFactory = $uploaderFactory;
        $this->config = $config;
        $this->blockFactory = $blockFactory;
    }

    /**
     * Allow users to upload images to the folder structure
     *
     * @return \Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        try {
            $params = $this->getRequest()->getParams();
            $contentTypes = $this->config->getContentTypes();
            $backendBlockClassName = $contentTypes[$params['role']]['backend_block'];
            $backendBlockInstance = $this->blockFactory->createBlock(
                $backendBlockClassName,
                ['data' => $params]
            );
            $result = ['content' => $backendBlockInstance->toHtml()];
        } catch (\Exception $e) {
            $result = ['error' => $e->getMessage(), 'errorcode' => $e->getCode()];
        }
        return $this->resultFactory->create(ResultFactory::TYPE_JSON)->setData($result);
    }
}
