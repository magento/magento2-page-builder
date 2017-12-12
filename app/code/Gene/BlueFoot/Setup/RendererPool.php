<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup;

class RendererPool
{
    /**
     * @var array
     */
    private $renderers;

    public function __construct(
        array $renderers
    ) {
        $this->renderers = $renderers;
    }

    /**
     * Get renderer for content type
     *
     * @param string $contentType
     * @return RendererInterface
     */
    public function getRender($contentType)
    {
        return $this->renderers[$contentType];
    }
}
