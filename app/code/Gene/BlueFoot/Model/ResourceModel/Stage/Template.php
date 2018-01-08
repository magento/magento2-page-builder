<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\ResourceModel\Stage;

/**
 * Class Template
 */
class Template extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    /**
     * Initialize resource model
     *
     * @return void
     *
     * @codingStandardsIgnoreStart
     */
    protected function _construct()
    {
        $this->_init('gene_bluefoot_stage_template', 'template_id');
    }
}
