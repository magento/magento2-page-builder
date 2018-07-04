<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Setup\DataConverter;

/**
 * Define keys that used to determine if the content is PageBuilder format or content contains unmigrated data
 */
class Format
{
    // PageBuilder format key <!--GENE_BLUEFOOT="[]"-->
    const BLUEFOOT_KEY = 'GENE_BLUEFOOT';

    // Key of not migrated content in the new format <!--UNMIGRATED_CONTENT="[]"-->
    const UNMIGRATED_KEY = 'UNMIGRATED_CONTENT';
}
