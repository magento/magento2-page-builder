<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider;

use Magento\PageBuilder\Model\Config\ContentType\AdditionalData\ProviderInterface;
use Magento\Store\Model\StoreManagerInterface;

/**
 * Provides current store ID
 */
class StoreId implements ProviderInterface
{
    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    /**
     * @param StoreManagerInterface $storeManager
     */
    public function __construct(StoreManagerInterface $storeManager)
    {
        $this->storeManager = $storeManager;
    }

    /**
     * @inheritdoc
     */
    public function getData(string $itemName) : array
    {
        return [$itemName => $this->storeManager->getStore()->getId()];
    }
}
