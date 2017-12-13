<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

interface ChildrenExtractorInterface
{
    /**
     * Extract children for an element
     *
     * @param array $data
     * @return array
     */
    public function extract($data);
}
