<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model;

class Entity extends \Magento\Framework\Model\AbstractModel
{
    /**
     * Return the entity name
     */
    const ENTITY = 'gene_bluefoot_entity';

    /**
     * Return the cache tag
     */
    const CACHE_TAG = 'gene_bluefoot_entity';

    /**
     * Initialize entity model
     *
     * @return void
     */
    public function _construct()
    {
        $this->_init(\Gene\BlueFoot\Model\ResourceModel\Entity::class);
    }
}
