<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentTypes\AdditionalData;

interface ProviderFactoryInterface
{
    /**
     * Create a ProviderInterface instance
     *
     * @param $instanceName
     * @return ProviderInterface
     */
    public function createInstance($instanceName): ProviderInterface;
}
