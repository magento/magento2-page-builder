<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Setup\DataConverter\ChildrenExtractor;

use Magento\PageBuilder\Setup\DataConverter\ChildrenExtractorInterface;

/**
 * Children data extractor for elements that don't have children
 */
class Dummy implements ChildrenExtractorInterface
{
    /**
     * {@inheritdoc}
     */
    public function extract(array $data) : array
    {
        return [];
    }
}
