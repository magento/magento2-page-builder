<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\TestModulePageBuilderExtensionPoints\Model\Stage\Renderer;

/**
 * Class Test
 */
class Test implements \Magento\PageBuilder\Model\Stage\RendererInterface
{
    /**
     * Render test data
     *
     * @param array $params
     * @return array
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function render(array $params): array
    {
        return ['content' => 'Test Content'];
    }
}
