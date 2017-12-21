<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

/**
 * Render individual content types to their new format
 */
interface RendererInterface
{
    /**
     * Render HTML for content type
     *
     * @param array $itemData
     * @param array $additionalData
     * @return string
     */
    public function render(array $itemData, array $additionalData = []);
}
