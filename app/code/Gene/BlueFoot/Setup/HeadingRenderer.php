<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup;

class HeadingRenderer implements RendererInterface
{
    /**
     * {@inheritdoc}
     */
    public function render($itemData, $additionalData = [])
    {
        return '<h2 data-role="heading">Heading text</h2>';
    }
}
