<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup;

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
    public function getExtractor($contentType)
    {
        if (isset($this->extractors[$contentType])) {
            return $this->extractors[$contentType];
        }
        return $this->extractors['default'];
    }
}
