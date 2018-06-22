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
     * @var \Magento\PageBuilder\Model\Stage\RendererPool
     */
    private $rendererPool;

    /**
     * Constructor
     *
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\PageBuilder\Model\Stage\RendererPool $rendererPool
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\PageBuilder\Model\Stage\RendererPool $rendererPool
    ) {
        parent::__construct($context);

        $this->rendererPool = $rendererPool;
    }

    /**
     * Generates an HTML preview for the stage
     *
     * @return \Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        try {
            $params = $this->getRequest()->getParams();
            $renderer = $this->rendererPool->getRenderer($params['role']);
            $result = ['content' => $renderer->render($params)];
        } catch (\Exception $e) {
            $result = [
                'error' => $e->getMessage(),
                'errorcode' => $e->getCode()
            ];
        }
        return $this->resultFactory->create(ResultFactory::TYPE_JSON)->setData($result);
    }
}
