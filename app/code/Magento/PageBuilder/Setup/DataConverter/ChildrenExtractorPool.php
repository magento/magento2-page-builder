<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Setup\DataConverter;

/**
 * Pool of children extractors for content types
 *
 * @api
 */
class ChildrenExtractorPool
{
    /**
     * @var array
     */
    private $extractors;

    /**
     * Constructor
     *
     * @param array $extractors
     */
    public function __construct(
        array $extractors
    ) {
        $this->extractors = $extractors;
    }

    /**
     * Get children extractor for content type
     *
     * @param string $contentType
     * @return ChildrenExtractorInterface
     */
    public function getExtractor($contentType) : ChildrenExtractorInterface
    {
        if (isset($this->extractors[$contentType])) {
            return $this->extractors[$contentType];
        }
        return $this->extractors['default'];
    }
}
