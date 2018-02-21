<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter;

/**
 * Render children for current content type
 */
interface ChildrenRendererInterface
{
    /**
     * Render children for element
     *
     * @param array $children
     * @param $renderChildCallback
     *
     * @return mixed
     */
    public function render(array $children, $renderChildCallback);
}
