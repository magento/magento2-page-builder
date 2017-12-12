<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup;

class ColumnRenderer implements RendererInterface
{
    /**
     * {@inheritdoc}
     */
    public function render($itemData, $additionalData)
    {
        return '<div data-role="column">' . $additionalData['children'] . '</div>';
    }
}
