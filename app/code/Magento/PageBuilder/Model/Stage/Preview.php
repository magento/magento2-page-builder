<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage;

use Magento\Framework\App\Area;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\State;
use Magento\Framework\View\Design\Theme\ThemeProviderInterface;
use Magento\Framework\View\DesignInterface;
use Magento\Store\Model\App\Emulation;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\StoreManagerInterface;

/**
 * Handle placing Magento into Page Builder Preview mode and emulating the store front
 */
class Preview
{
    /**
     * @var Emulation
     */
    private $emulation;

    /**
     * @var State
     */
    private $appState;

    /**
     * @var DesignInterface
     */
    private $design;

    /**
     * @var ThemeProviderInterface
     */
    private $themeProvider;

    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * @var bool
     */
    private $isPreview = false;

    /**
     * Preview constructor.
     * @param Emulation $emulation
     * @param State $appState
     * @param DesignInterface $design
     * @param ThemeProviderInterface $themeProvider
     * @param StoreManagerInterface $storeManager
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        Emulation $emulation,
        State $appState,
        DesignInterface $design,
        ThemeProviderInterface $themeProvider,
        StoreManagerInterface $storeManager,
        ScopeConfigInterface $scopeConfig
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
        return Area::AREA_FRONTEND;
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
            $storeId = $this->getStoreId();
        }
        $this->emulation->startEnvironmentEmulation($storeId);

        return $this->appState->emulateAreaCode(
            $this->getPreviewArea(),
            function () use ($callback) {
                $themeId = $this->scopeConfig->getValue(
                    'design/theme/theme_id',
                    ScopeInterface::SCOPE_STORE
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

    /**
     * Returns store id by default store view or store id from the available store if default store view is null
     *
     * @return int|null
     */
    private function getStoreId(): ?int
    {
        $storeId = null;
        $store = $this->storeManager->getDefaultStoreView();
        if ($store) {
            $storeId = (int) $store->getId();
        } else {
            $stores = $this->storeManager->getStores();
            if (count($stores)) {
                $store = array_shift($stores);
                $storeId = (int) $store->getId();
            }
        }

        return $storeId;
    }
}
