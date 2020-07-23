<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\View\ConfigInterface;

/**
 * Container for the configuration related to the widget initializer mechanism
 */
class WidgetInitializerConfig
{
    /**
     * @var array The provided configuration
     */
    private $config;

    /**
     * @var ConfigInterface
     */
    private $viewConfig;

    /**
     * @param array $config
     * @param ConfigInterface|null $viewConfig
     */
    public function __construct(
        array $config,
        ConfigInterface $viewConfig = null
    ) {
        $this->config = $config;
        $this->viewConfig = $viewConfig ?: ObjectManager::getInstance()->get(ConfigInterface::class);
    }

    /**
     * Retrieves the component-ready configuration for the widget initializer
     *
     * @return array
     */
    public function getConfig(): array
    {
        $resultConfig = [];
        foreach ($this->config as $contentTypeName => $config) {
            foreach ($config as $item) {
                $selector = sprintf('[data-content-type="%s"]', $contentTypeName);
                if (!isset($item['component'])) {
                    continue;
                }
                if (isset($item['appearance'])) {
                    $selector .= sprintf('[data-appearance="%s"]', $item['appearance']);
                }
                $componentConfig = isset($item['config']) ? $item['config'] : false;
                $resultConfig[$selector][$item['component']] = $componentConfig;
            }
        }
        return $resultConfig;
    }

    /**
     * Returns breakpoint for widgets initializer component.
     *
     * @return array
     */
    public function getBreakpoints(): array
    {
        return $this->viewConfig->getViewConfig()->getVarValue(
            'Magento_PageBuilder',
            'breakpoints'
        );
    }
}
