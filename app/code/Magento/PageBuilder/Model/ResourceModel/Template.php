<?php
/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;
use Magento\PageBuilder\Api\Data\TemplateInterface;

/**
 * Template resource model
 */
class Template extends AbstractDb
{
    /**
     * Define resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('pagebuilder_template', TemplateInterface::KEY_ID);
    }
}
