<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\ChildrenExtractor;

use Gene\BlueFoot\Setup\DataConverter\ChildrenExtractorInterface;

/**
 * Children data extractor for elements that don't have children
 */
class Dummy implements ChildrenExtractorInterface
{
    /**
     * {@inheritdoc}
     */
    public function extract(array $data)
    {
        return [];
    }
}
