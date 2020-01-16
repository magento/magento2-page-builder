<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\Converters;

use Magento\Framework\DB\DataConverter\DataConverterInterface;

class MoveAttribute implements DataConverterInterface
{
    /**
     * @inheritDoc
     */
    public function convert($value) {
        //Perform content conversion
        return $value;
    }
}