<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model;

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
     * @param array $config
     */
    public function __construct(array $config)
    {
        $this->config = $config;
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
            $selector = sprintf('[data-content-type="%s"]', $contentTypeName);
            foreach ($config as $item) {
                if (!isset($item['component'])) {
                    continue;
                }
                if (isset($item['appearance'])) {
                    $selector .= sprintf('[data-appearance="%s"]', $item['appearance']);
                }
                $componentConfig = isset($item['config']) ? $item['config'] : '{}';
                $resultConfig[$selector][$item['component']] = $componentConfig;
            }
        }
        return $resultConfig;
    }
}
