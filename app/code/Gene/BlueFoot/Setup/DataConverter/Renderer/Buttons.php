<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\Renderer;

use Gene\BlueFoot\Setup\DataConverter\RendererInterface;

/**
 * Render buttons to PageBuilder format
 */
class Buttons implements RendererInterface
{
    /**
     * {@inheritdoc}
     */
    public function render(array $itemData, array $additionalData = [])
    {
        return '<div data-role="buttons">' . $additionalData['children'] . '</div>';
    }
}
