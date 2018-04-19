<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentTypes\AdditionalData\Provider;

use Magento\PageBuilder\Model\Config\ContentTypes\AdditionalData\ProviderInterface;
use Magento\Store\Model\StoreManagerInterface;

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
    public function getData()
    {
        return $this->storeManager->getStore()->getId();
    }
}
