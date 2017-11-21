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
     * @var \Gene\BlueFoot\Model\Config
     */
    private $config;

    /**
     * @var \Magento\Framework\View\Element\BlockFactory
     */
    private $blockFactory;

    /**
     * Constructor
     *
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     * @param \Gene\BlueFoot\Model\Config $config
     * @param \Magento\Framework\View\Element\BlockFactory $blockFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Gene\BlueFoot\Model\Config $config,
        \Magento\Framework\View\Element\BlockFactory $blockFactory
    ) {
        parent::__construct($context);

        $this->resultJsonFactory = $resultJsonFactory;
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
            $error = false;
            $params = $this->getRequest()->getParams();
            $contentTypes = $this->config->getContentTypes();
            $backendBlockClassName = isset($contentTypes[$params['role']]['backend_block'])
                ? $contentTypes[$params['role']]['backend_block'] : false;
            if (!$backendBlockClassName) {
                $error = true;
            }
            $backendBlockInstance = $this->blockFactory->createBlock(
                $backendBlockClassName,
                ['data' => $params]
            );
            if (!$error) {
                $result = [
                    'content' => $backendBlockInstance->toHtml()
                ];
            } else {
                $result = ['content' => ''];
            }
        } catch (\Exception $e) {
            $result = [
                'error' => $e->getMessage(),
                'errorcode' => $e->getCode()
            ];
        }
        return $this->resultFactory->create(ResultFactory::TYPE_JSON)->setData($result);
    }
}
