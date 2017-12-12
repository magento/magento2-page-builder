<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup;

class DummyChildrenExtractor implements ChildrenExtractorInterface
{
    /**
     * {@inheritdoc}
     */
    public function extract($data)
    {
        return [];
    }
}
