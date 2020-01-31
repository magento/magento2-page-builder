<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\ResourceModel\Template;

use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;
use Magento\PageBuilder\Model\Template;
use Magento\PageBuilder\Model\ResourceModel\Template as ResourceTemplate;

/**
 * Template collection
 */
class Collection extends AbstractCollection
{

    /**
     * Define resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init(
            Template::class,
            ResourceTemplate::class
        );
    }
}
