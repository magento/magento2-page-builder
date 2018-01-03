<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock;

/**
 * Class Group
 */
class Group extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        $this->_init('gene_bluefoot_entity_type_group', 'group_id');
    }
}
