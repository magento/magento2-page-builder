<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\ChildrenExtractor;

use Gene\BlueFoot\Setup\DataConverter\ChildrenExtractorInterface;

class Dummy implements ChildrenExtractorInterface
{
    /**
     * {@inheritdoc}
     */
    public function extract($data)
    {
        return [];
    }
}
