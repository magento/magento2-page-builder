<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Controller\ContentType;

use Magento\Framework\Controller\ResultFactory;

/**
 * Preview controller to render blocks preview on Stage
 * @api
 */
class Preview extends \Magento\Framework\App\Action\Action
{
    /**
     * @var \Magento\PageBuilder\Model\Config
     */
    private $config;

    /**
     * @var \Magento\Framework\View\Element\BlockFactory
     */
    private $blockFactory;

    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    private $storeManager;

    /**
     * @var \Magento\Widget\Model\Template\Filter
     */
    private $directiveFilter;

    /**
     * Constructor
     *
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\PageBuilder\Model\Config $config
     * @param \Magento\Framework\View\Element\BlockFactory $blockFactory
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Widget\Model\Template\Filter $directiveFilter
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\PageBuilder\Model\Config $config,
        \Magento\Framework\View\Element\BlockFactory $blockFactory,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Widget\Model\Template\Filter $directiveFilter
    ) {
        parent::__construct($context);

        $this->config = $config;
        $this->blockFactory = $blockFactory;
        $this->storeManager = $storeManager;
        $this->directiveFilter = $directiveFilter;
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

            // If passed, this needs to be rendered as a directive
            if (!empty($params['directive'])) {
                $pageResult = $this->resultFactory->create(ResultFactory::TYPE_PAGE);
                $pageResult->initLayout();
                $storeId = $this->storeManager->getStore()->getId();
                $content = $this->directiveFilter
                    ->setStoreId($storeId)
                    ->filter($params['directive']);
                $result = ['content' => $content];
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
