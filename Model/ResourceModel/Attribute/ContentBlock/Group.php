<?php

namespace Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock;

/**
 * Class Group
 *
 * @package Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Group extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        $this->_init('gene_bluefoot_entity_type_group','group_id');
    }
}