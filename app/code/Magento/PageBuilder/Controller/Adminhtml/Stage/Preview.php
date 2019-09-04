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
 *
 * This isn't placed within the adminhtml folder as it has to extend from the front-end controllers app action to
 * ensure the content is rendered in the storefront scope.
 *
 * @api
 */
class Preview extends \Magento\Backend\App\Action implements HttpPostActionInterface
{
    const ADMIN_RESOURCE = 'Magento_Backend::content';

    /**
     * @var \Magento\PageBuilder\Model\Stage\RendererPool
     */
    private $rendererPool;

    /**
     * @var \Magento\Framework\App\State
     */
    private $appState;

    /**
     * @var \Magento\Theme\Model\View\Design
     */
    private $design;

    /**
     * @var \Magento\Framework\View\Design\Theme\ThemeProviderInterface
     */
    private $themeProvider;

    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    private $storeManager;

    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * @var \Magento\Store\Model\App\Emulation
     */
    private $emulation;

    /**
     * @var \Magento\PageBuilder\Model\Stage\PreviewRegistry
     */
    private $previewRegistry;

    /**
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\PageBuilder\Model\Stage\RendererPool $rendererPool
     * @param \Magento\Store\Model\App\Emulation $emulation
     * @param \Magento\Framework\App\State $appState
     * @param \Magento\Framework\View\DesignInterface $design
     * @param \Magento\Framework\View\Design\Theme\ThemeProviderInterface $themeProvider
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
     * @param \Magento\PageBuilder\Model\Stage\PreviewRegistry $previewRegistry
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\PageBuilder\Model\Stage\RendererPool $rendererPool,
        \Magento\Store\Model\App\Emulation $emulation,
        \Magento\Framework\App\State $appState,
        \Magento\Framework\View\DesignInterface $design,
        \Magento\Framework\View\Design\Theme\ThemeProviderInterface $themeProvider,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\PageBuilder\Model\Stage\PreviewRegistry $previewRegistry
    ) {
        parent::__construct($context);

        $this->rendererPool = $rendererPool;
        $this->emulation = $emulation;
        $this->appState = $appState;
        $this->design = $design;
        $this->themeProvider = $themeProvider;
        $this->storeManager = $storeManager;
        $this->scopeConfig = $scopeConfig;
        $this->previewRegistry = $previewRegistry;
    }

    /**
     * Generates an HTML preview for the stage
     *
     * @return \Magento\Framework\App\ResponseInterface|\Magento\Framework\Controller\ResultInterface|mixed
     * @throws \Exception
     */
    public function execute()
    {
        $defaultStore = $this->storeManager->getDefaultStoreView();
        $this->previewRegistry->setIsPreview(true);
        $this->emulation->startEnvironmentEmulation($defaultStore->getId());

        return $this->appState->emulateAreaCode(
            $this->previewRegistry->getPreviewArea(),
            function () {
                $themeId = $this->scopeConfig->getValue(
                    'design/theme/theme_id',
                    \Magento\Store\Model\ScopeInterface::SCOPE_STORE
                );
                $theme = $this->themeProvider->getThemeById($themeId);
                $this->design->setDesignTheme($theme, $this->previewRegistry->getPreviewArea());

                $pageResult = $this->resultFactory->create(ResultFactory::TYPE_PAGE);
                // Some template filters and directive processors expect this to be called in order to function.
                $pageResult->initLayout();

                $params = $this->getRequest()->getParams();
                $renderer = $this->rendererPool->getRenderer($params['role']);
                $result = ['data' => $renderer->render($params)];

                $response = $this->resultFactory->create(ResultFactory::TYPE_JSON)->setData($result);
                $this->emulation->stopEnvironmentEmulation();
                $this->previewRegistry->setIsPreview(false);
                return $response;
            }
        );
    }
}
