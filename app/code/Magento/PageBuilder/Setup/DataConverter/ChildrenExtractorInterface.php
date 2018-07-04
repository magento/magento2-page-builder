<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Setup\DataConverter;

/**
 * Extract children data from content type data
 *
 * @api
 */
interface ChildrenExtractorInterface
{
    /**
     * Extract children for an element
     *
     * @param array $data
     * @return array
     */
    public function extract(array $data) : array;
}
