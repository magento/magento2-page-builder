<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog\Sorting\Sku;

use \Magento\PageBuilder\Model\Catalog\Sorting\AttributeAbstract;

/**
 * Class Sku\Ascending
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting\Sku
 */
class Ascending extends AttributeAbstract
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
        return $this->ascOrder();
    }

    /**
     * @inheritdoc
     */
    public function getLabel(): string
    {
        return __('SKU: Ascending');
    }
}
