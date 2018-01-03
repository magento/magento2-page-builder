<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\Group;

/**
 * Class Collection
 */
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    /**
     * Constructor
     */
    protected function _construct()
    {
        $this->_init(
            'Gene\BlueFoot\Model\Attribute\ContentBlock\Group',
            'Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\Group'
        );
    }

    /**
     * Convert the collection into an option hash
     *
     * @return array
     */
    public function toOptionHash()
    {
        return $this->_toOptionHash('group_id', 'name');
    }
}
