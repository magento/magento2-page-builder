<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\ChildrenExtractor;

use Gene\BlueFoot\Setup\DataConverter\ChildrenExtractorInterface;

/**
 * Children data extractor that can be configured with path to children data
 */
class Configurable implements ChildrenExtractorInterface
{
    /**
     * @var string
     */
    private $path;

    /**
     * Configurable constructor.
     *
     * @param string $path
     */
    public function __construct(
        string $path
    ) {
        $this->path = $path;
    }

    /**
     * {@inheritdoc}
     */
    public function extract(array $data)
    {
        $parts = explode('/', $this->path);
        $children = [];
        foreach ($parts as $part) {
            if (isset($data[$part])) {
                $data = $children = $data[$part];
            }
        }
        return $children;
    }
}
