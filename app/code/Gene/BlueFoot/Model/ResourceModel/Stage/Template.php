<?php

namespace Gene\BlueFoot\Model\ResourceModel\Stage;

/**
 * Class Template
 *
 * @package Gene\BlueFoot\Model\ResourceModel\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
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
