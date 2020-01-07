<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage;

/**
 * Handle placing Magento into Page Builder Preview mode and emulating the store front
 */
class Preview
{
    /**
     * @var \Magento\Store\Model\App\Emulation
     */
    private $emulation;

    /**
     * @var \Magento\Framework\App\State
     */
    private $appState;

    /**
     * @var \Magento\Framework\View\DesignInterface
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
     * @var bool
     */
    private $isPreview = false;

    /**
     * Preview constructor.
     * @param \Magento\Store\Model\App\Emulation $emulation
     * @param \Magento\Framework\App\State $appState
     * @param \Magento\Framework\View\DesignInterface $design
     * @param \Magento\Framework\View\Design\Theme\ThemeProviderInterface $themeProvider
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        \Magento\Store\Model\App\Emulation $emulation,
        \Magento\Framework\App\State $appState,
        \Magento\Framework\View\DesignInterface $design,
        \Magento\Framework\View\Design\Theme\ThemeProviderInterface $themeProvider,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
    ) {
        $this->emulation = $emulation;
        $this->appState = $appState;
        $this->design = $design;
        $this->themeProvider = $themeProvider;
        $this->storeManager = $storeManager;
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Retrieve the area in which the preview needs to be ran in
     *
     * @return string
     */
    public function getPreviewArea() : string
    {
        return \Magento\Framework\App\Area::AREA_FRONTEND;
    }

    /**
     * Start Page Builder preview mode and emulate store front
     *
     * @param callable $callback
     * @param int $storeId
     * @return mixed
     * @throws \Exception
     */
    public function startPreviewMode($callback, $storeId = null)
    {
        $this->isPreview = true;

        if (!$storeId) {
            $storeId = $this->storeManager->getDefaultStoreView()->getId();
        }
        $this->emulation->startEnvironmentEmulation($storeId);

        return $this->appState->emulateAreaCode(
            $this->getPreviewArea(),
            function () use ($callback) {
                $themeId = $this->scopeConfig->getValue(
                    'design/theme/theme_id',
                    \Magento\Store\Model\ScopeInterface::SCOPE_STORE
                );
                $theme = $this->themeProvider->getThemeById($themeId);
                $this->design->setDesignTheme($theme, $this->getPreviewArea());

                try {
                    $result = $callback();
                } catch (\Exception $e) {
                    $this->isPreview = false;
                    throw $e;
                }

                $this->emulation->stopEnvironmentEmulation();
                return $result;
            }
        );
    }

    /**
     * Determine if the system is in preview mode
     *
     * @return bool
     */
    public function isPreviewMode() : bool
    {
        return $this->isPreview;
    }
}
