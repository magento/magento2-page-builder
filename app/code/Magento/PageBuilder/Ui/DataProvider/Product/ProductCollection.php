<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Ui\DataProvider\Product;

/**
 * PageBuilder ProductCollection class for allowing store-agnostic collections
 */
class ProductCollection extends \Magento\Catalog\Model\ResourceModel\Product\Collection
{
    /**
     * Set store id even if it's equal to \Magento\Store\Model\Store::DEFAULT_STORE_ID to prevent inadvertent resetting
     * {@inheritdoc}
     */
    public function addStoreFilter($store = null)
    {
        if ($store !== null && (int) $store === 0) {
            $this->setStoreId($store);
        }

        return parent::addStoreFilter($store);
    }

    /**
     * Prevent usage of catalog index for querying visibility, as it relies on a specific store id.
     * Visibility condition is to be added later in plugin.
     * @see \Magento\PageBuilder\Plugin\CatalogWidget\Block\Product\ProductsListPlugin::aroundGetData
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     * {@inheritdoc}
     */
    public function setVisibility($visibility)
    {
        return $this;
    }

    /**
     * Prevent usage of price index for querying prices, as it relies on a specific store id.
     * {@inheritdoc}
     */
    protected function _productLimitationJoinPrice()
    {
        $this->_productLimitationFilters->setUsePriceIndex(false);
        return $this->_productLimitationPrice(false);
    }
}
