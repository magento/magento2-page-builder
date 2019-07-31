<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting;

/**
 * Class SortAbstract
 */
class SortAbstract
{
    /**
     * Sorting ascending order
     *
     * @return string
     */
    protected function ascOrder(): string
    {
        return \Magento\Framework\DB\Select::SQL_ASC;
    }

    /**
     * Sorting descending order
     *
     * @return string
     */
    protected function descOrder(): string
    {
        return \Magento\Framework\DB\Select::SQL_DESC;
    }
}
