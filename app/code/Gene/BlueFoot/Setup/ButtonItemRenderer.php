<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup;

class ButtonItemRenderer implements RendererInterface
{
    /**
     * {@inheritdoc}
     */
    public function render($itemData, $additionalData)
    {
        return '<button data-role="button-item"></button>';
    }
}
