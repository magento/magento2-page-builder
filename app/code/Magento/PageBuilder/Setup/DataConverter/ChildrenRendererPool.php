<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Setup\DataConverter;

/**
 * Pool of children renderers for content types
 * @api
 */
class ChildrenRendererPool
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
     * Get children renderer for content type
     *
     * @param string $contentType
     * @return ChildrenRendererInterface
     */
    public function getChildrenRenderer(string $contentType) : ChildrenRendererInterface
    {
        if (isset($this->renderers[$contentType])) {
            return $this->renderers[$contentType];
        }
        return $this->renderers['default'];
    }
}
