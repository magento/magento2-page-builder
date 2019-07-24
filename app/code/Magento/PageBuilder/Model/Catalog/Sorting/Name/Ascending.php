<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog\Sorting\Name;

use \Magento\PageBuilder\Model\Catalog\Sorting\AttributeAbstract;

/**
 * Class Name\Ascending
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting\Name
 */
class Ascending extends AttributeAbstract
{
    /**
     * @inheritdoc
     */
    protected function getSortField()
    {
        return 'name';
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
        return __('Name: A - Z');
    }
}
