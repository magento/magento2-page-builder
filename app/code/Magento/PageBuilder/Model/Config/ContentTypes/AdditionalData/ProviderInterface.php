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
     *
     * @return mixed
     */
    public function getData();
}
