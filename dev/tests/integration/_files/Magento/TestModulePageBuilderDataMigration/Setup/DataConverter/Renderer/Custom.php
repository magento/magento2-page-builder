<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\TestModulePageBuilderDataMigration\Setup\DataConverter\Renderer;

use Magento\PageBuilderDataMigration\Setup\DataConverter\RendererInterface;

/**
 * Render custom content type to PageBuilder format
 */
class Custom implements RendererInterface
{
    /**
     * {@inheritdoc}
     */
    public function render(array $itemData, array $additionalData = []) : string
    {
        return '<div data-element="main" data-role="custom" data-appearance="default"></div>';
    }
}
