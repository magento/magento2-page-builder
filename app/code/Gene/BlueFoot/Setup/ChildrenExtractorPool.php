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
     * @var ChildrenExtractorInterface
     */
    private $defaultExtractor;

    /**
     * Constructor
     *
     * @param array $extractors
     * @param ChildrenExtractorInterface $defaultExtractor
     */
    public function __construct(
        array $extractors,
        ChildrenExtractorInterface $defaultExtractor
    ) {
        $this->extractors = $extractors;
        $this->defaultExtractor = $defaultExtractor;
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
        return $this->defaultExtractor;
    }
}
