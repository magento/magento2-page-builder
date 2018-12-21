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
 */
class ProductCollection extends \Magento\Catalog\Model\ResourceModel\Product\Collection
{
    /**
     * Prevent usage of catalog index for querying visibility, as it relies on a specific store id.
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

    /**
     * Prevent usage of price index for querying prices, as it relies on a specific store id.
     * @inheritdoc
     */
    protected function _productLimitationJoinPrice()
    {
        $this->_productLimitationFilters->setUsePriceIndex($this->getStoreId() !== Store::DEFAULT_STORE_ID);
        return $this->_productLimitationPrice(false);
    }
}
