<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\TestModulePageBuilderDataMigration\Model\Config\ContentTypes\AdditionalData\Provider;

use Magento\PageBuilder\Model\Config\ContentTypes\AdditionalData\ProviderInterface;

class TestData implements ProviderInterface
{
    public function getData(string $itemName) : array
    {
        return [$itemName => 'test data'];
    }
}
