<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\TestModulePageBuilderDataMigration\Model;

class FakeMathRandom extends \Magento\Framework\Math\Random
{
    // Always return 1
    public static function getRandomNumber($min = 0, $max = NULL)
    {
        return 1;
    }
}
