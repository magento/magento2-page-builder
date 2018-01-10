<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter;

/**
 * Extract children data from content type data
 */
interface ChildrenExtractorInterface
{
    /**
     * Extract children for an element
     *
     * @param array $data
     * @return array
     */
    public function extract(array $data);
}
