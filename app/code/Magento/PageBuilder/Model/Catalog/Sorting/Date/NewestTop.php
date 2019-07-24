<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog\Sorting\Date;

use \Magento\PageBuilder\Model\Catalog\Sorting\AttributeAbstract;

/**
 * Class NewestTop
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting\Date
 */
class NewestTop extends AttributeAbstract
{
    /**
     * @inheritdoc
     */
    protected function getSortField()
    {
        return 'entity_id';
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
        return __('Newest products first');
    }
}
