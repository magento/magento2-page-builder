<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);
namespace Magento\PageBuilder\Setup\DataConverter;

/**
 * Render children for current content type
 *
 * @api
 */
interface ChildrenRendererInterface
{
    /**
     * Render children for element
     *
     * @param array $children
     * @param $renderChildCallback
     *
     * @return string
     */
    public function render(array $children, $renderChildCallback) : string;
}
