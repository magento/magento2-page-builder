<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\Renderer;

use Gene\BlueFoot\Setup\DataConverter\RendererInterface;

class Row implements RendererInterface
{
    /**
     * {@inheritdoc}
     */
    public function render($itemData, $additionalData = [])
    {
        return '<div data-role="row">' . $additionalData['children'] . '</div>';
    }
}
