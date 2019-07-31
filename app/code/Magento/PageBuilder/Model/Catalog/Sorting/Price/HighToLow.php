<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting\Price;

use Magento\PageBuilder\Model\Catalog\Sorting\PriceAbstract;

/**
 * Class Price\HighToLow
 */
class HighToLow extends PriceAbstract
{
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
    public function getLabel(): \Magento\Framework\Phrase
    {
        return __('Price: high to low');
    }
}
