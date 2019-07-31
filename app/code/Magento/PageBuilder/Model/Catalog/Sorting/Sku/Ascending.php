<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting\Sku;

use Magento\PageBuilder\Model\Catalog\Sorting\AttributeAbstract;

/**
 * Class Sku\Ascending
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
    public function getLabel(): \Magento\Framework\Phrase
    {
        return __('SKU: ascending');
    }
}
