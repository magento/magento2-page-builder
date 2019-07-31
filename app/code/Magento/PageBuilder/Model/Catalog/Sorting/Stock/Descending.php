<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting\Stock;

/**
 * Class Stock\Descending
 */
class Descending extends \Magento\PageBuilder\Model\Catalog\Sorting\StockAbstract
{
    /**
     * @inheritdoc
     */
    protected function getSortDirection(): string
    {
        return $this->descOrder();
    }

    /**
     * @inheritdoc
     */
    public function getLabel(): \Magento\Framework\Phrase
    {
        return __('Stock: high stock first');
    }
}
