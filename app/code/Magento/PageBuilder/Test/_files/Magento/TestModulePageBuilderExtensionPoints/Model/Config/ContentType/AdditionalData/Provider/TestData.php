<?php
/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\TestModulePageBuilderExtensionPoints\Model\Config\ContentType\AdditionalData\Provider;

use Magento\PageBuilder\Model\Config\ContentType\AdditionalData\ProviderInterface;

class TestData implements ProviderInterface
{
    public function getData(string $itemName) : array
    {
        return [$itemName => 'test data'];
    }
}
