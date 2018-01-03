<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\ResourceModel\Stage\Template;

/**
 * Class Collection
 */
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    /**
     * @var string
     *
     * @codingStandardsIgnoreStart
     */
    protected $_idFieldName = 'template_id';

    /**
     * Define resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('Gene\BlueFoot\Model\Stage\Template', 'Gene\BlueFoot\Model\ResourceModel\Stage\Template');
    }
}
