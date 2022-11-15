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
use Magento\Store\Model\Store;

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
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        Emulation $emulation,
        State $appState,
        DesignInterface $design,
        ThemeProviderInterface $themeProvider,
        ScopeConfigInterface $scopeConfig
    ) {
        $this->emulation = $emulation;
        $this->appState = $appState;
        $this->design = $design;
        $this->themeProvider = $themeProvider;
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
            $storeId = Store::DEFAULT_STORE_ID;
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
}
