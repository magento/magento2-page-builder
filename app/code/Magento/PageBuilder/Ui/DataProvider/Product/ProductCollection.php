<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Ui\DataProvider\Product;

use Magento\Store\Model\Store;

/**
 * PageBuilder ProductCollection class for allowing store-agnostic collections
 *
 * @SuppressWarnings(PHPMD.CookieAndSessionMisuse)
 */
class ProductCollection extends \Magento\Catalog\Model\ResourceModel\Product\Collection
{
    /**
     * @inheritdoc
     */
    public function setVisibility($visibility)
    {
        if ($this->getStoreId() === Store::DEFAULT_STORE_ID) {
            $this->addAttributeToFilter('visibility', $visibility);
        } else {
            parent::setVisibility($visibility);
        }

        return $this;
    }
}
