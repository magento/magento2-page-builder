<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog\Sorting\Sku;

use \Magento\PageBuilder\Model\Catalog\Sorting\AttributeAbstract;

/**
 * Class Sku\Descending
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting\Sku
 */
class Descending extends AttributeAbstract
{
    /**
     * @inheritdoc
     */
    protected function getSortField()
    {
        return 'sku';
    }

    /**
     * @inheritdoc
     */
    protected function getSortDirection()
    {
        return $this->descOrder();
    }

    /**
     * @inheritdoc
     */
    public function getLabel(): string
    {
        return __('SKU: Descending');
    }
}
