<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage;

/**
 * Provides an interface for individual content type renderers for the stage
 */
interface RendererInterface
{
    /**
     * Render HTML for content type
     *
     * @param array $params
     * @return string
     */
    public function render(array $params): string;
}
