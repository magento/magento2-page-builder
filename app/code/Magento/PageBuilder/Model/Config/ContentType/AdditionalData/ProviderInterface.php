<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentType\AdditionalData;

/**
 * Provides runtime-specific data for additional data content types configuration
 *
 * @api
 */
interface ProviderInterface
{
    /**
     * Get data from the provider
     * @param string $itemName - the name of the item to use as key in returned array
     * @return array
     */
    public function getData(string $itemName) : array;
}
