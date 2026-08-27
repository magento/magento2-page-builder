<?php
/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\TestModulePageBuilderExtensionPoints\Model\Stage\Renderer;

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
