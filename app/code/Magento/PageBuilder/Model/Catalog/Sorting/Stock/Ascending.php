<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting\Stock;

/**
 * Class Stock\Ascending
 */
class Ascending extends \Magento\PageBuilder\Model\Catalog\Sorting\StockAbstract
{
    /**
     * @inheritdoc
     */
    protected function getSortDirection(): string
    {
        return $this->ascOrder();
    }

    /**
     * @inheritdoc
     */
    public function getLabel(): \Magento\Framework\Phrase
    {
        return __('Stock: low stock first');
    }
}
