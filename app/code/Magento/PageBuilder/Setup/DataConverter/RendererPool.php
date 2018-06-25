<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter;

/**
 * Pool of renderers for content types
 * @api
 */
class RendererPool
{
    /**
     * @var array
     */
    private $renderers;

    /**
     * Constructor
     *
     * @param array $renderers
     */
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
    public function getRenderer($contentType)
    {
        if (isset($this->renderers[$contentType])) {
            return $this->renderers[$contentType];
        }
        return $this->renderers['default'];
    }
}
