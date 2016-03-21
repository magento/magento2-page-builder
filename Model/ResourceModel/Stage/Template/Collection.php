<?php

namespace Gene\BlueFoot\Model\ResourceModel\Stage\Template;

/**
 * Class Collection
 *
 * @package Gene\BlueFoot\Model\ResourceModel\Stage\Template
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    /**
     * @var string
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