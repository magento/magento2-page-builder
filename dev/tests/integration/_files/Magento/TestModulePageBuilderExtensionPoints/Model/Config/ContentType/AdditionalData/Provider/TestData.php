<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\TestModulePageBuilderExtensionPoints\Model\Config\ContentType\AdditionalData\Provider;

use Magento\PageBuilder\Model\Config\ContentType\AdditionalData\ProviderInterface;

/**
 * Class TestData
 */
class TestData implements ProviderInterface
{
    public function getData(string $itemName) : array
    {
        return [$itemName => 'test data'];
    }
}
