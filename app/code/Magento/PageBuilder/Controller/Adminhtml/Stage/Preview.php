<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\Stage;

use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\App\Action\HttpPostActionInterface;

/**
 * Preview controller to render blocks preview on Stage
 */
class Preview extends \Magento\Backend\App\Action implements HttpPostActionInterface
{
    const ADMIN_RESOURCE = 'Magento_Backend::content';

    /**
     * @var \Magento\PageBuilder\Model\Stage\RendererPool
     */
    private $rendererPool;

    /**
     * @var \Magento\PageBuilder\Model\Stage\Preview
     */
    private $preview;

    /**
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\PageBuilder\Model\Stage\RendererPool $rendererPool
     * @param \Magento\PageBuilder\Model\Stage\Preview $preview
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\PageBuilder\Model\Stage\RendererPool $rendererPool,
        \Magento\PageBuilder\Model\Stage\Preview $preview
    ) {
        parent::__construct($context);

        $this->rendererPool = $rendererPool;
        $this->preview = $preview;
    }

    /**
     * Generates an HTML preview for the stage
     *
     * @return \Magento\Framework\App\ResponseInterface|\Magento\Framework\Controller\ResultInterface|mixed
     * @throws \Exception
     */
    public function execute()
    {
        return $this->preview->startPreviewMode(
            function () {
                $pageResult = $this->resultFactory->create(ResultFactory::TYPE_PAGE);
                // Some template filters and directive processors expect this to be called in order to function.
                $pageResult->initLayout();

                $params = $this->getRequest()->getParams();
                $renderer = $this->rendererPool->getRenderer($params['role']);
                $result = ['data' => $renderer->render($params)];

                return $this->resultFactory->create(ResultFactory::TYPE_JSON)->setData($result);
            }
        );
    }
}
