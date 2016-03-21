<?php

namespace Gene\BlueFoot\Model\Stage;

/**
 * Class Template
 *
 * @package Gene\BlueFoot\Model\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Template extends \Magento\Framework\Model\AbstractModel
{
    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('Gene\BlueFoot\Model\ResourceModel\Stage\Template');
    }
}