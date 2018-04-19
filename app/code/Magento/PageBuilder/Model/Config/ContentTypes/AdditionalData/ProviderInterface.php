<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentTypes\AdditionalData;

interface ProviderInterface
{
    /**
     * Get data from the provider
     * @param string $itemName - the name of the item to use as key in returned array
     * @return array
     */
    public function getData(string $itemName) : array;
}
