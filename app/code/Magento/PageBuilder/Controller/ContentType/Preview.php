<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Controller\ContentType;

use Magento\Framework\Controller\ResultFactory;

class Preview extends \Magento\Framework\App\Action\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    private $resultJsonFactory;

    /**
     * @var \Magento\PageBuilder\Model\Config
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
     * @param \Magento\PageBuilder\Model\Config $config
     * @param \Magento\Framework\View\Element\BlockFactory $blockFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Magento\PageBuilder\Model\Config $config,
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
            $params = $this->getRequest()->getParams();
            $contentTypes = $this->config->getContentTypes();
            $backendBlockClassName = isset($contentTypes[$params['role']]['backend_block'])
                ? $contentTypes[$params['role']]['backend_block'] : false;
            $backendBlockTemplate = isset($contentTypes[$params['role']]['backend_template'])
                ? $contentTypes[$params['role']]['backend_template'] : false;
            if ($backendBlockTemplate) {
                $params['template'] = $backendBlockTemplate;
            }
            if ($backendBlockClassName) {
                $backendBlockInstance = $this->blockFactory->createBlock(
                    $backendBlockClassName,
                    ['data' => $params]
                );
                $pageResult = $this->resultFactory->create(ResultFactory::TYPE_PAGE);
                $pageResult->getLayout()->addBlock($backendBlockInstance);
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
        return $this->resultJsonFactory->create()->setData($result);
    }
}
