<?php
/**
 * Copyright 2024 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\ViewModel;

use Magento\Backend\ViewModel\RequireJsConfigModifierInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;

/**
 * Modifies requirejs configuration for the stage render frame
 *
 * Override the text! plugin within the iframe to ensure we can pipe any XHR requests through to the parent window
 * as the same origin policy will not allow us to load the templates within this iframe.
 * It is important that this mapping is configured before requirejs-config.js to ensure the text! plugin is overridden
 * for all requests.
 */
class StageRenderFrameRequireJsConfigModifier implements ArgumentInterface, RequireJsConfigModifierInterface
{
    /**
     * @inheritDoc
     */
    public function modify(array $config): array
    {
        $config['map']['*'] = array_merge(
            $config['map']['*'] ?? [],
            [
                'text' => 'Magento_PageBuilder/js/master-format/render/requirejs/text',
                'Magento_PageBuilder/js/events' => 'Magento_PageBuilder/js/master-format/render/events'
            ]
        );
        return $config;
    }
}
