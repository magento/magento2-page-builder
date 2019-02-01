<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Model;

/**
 * Class Entity
 */
class Entity extends \Magento\Framework\Model\AbstractModel
{
    /**
     * Return the entity name
     */
    const ENTITY = 'gene_bluefoot_entity';

    /**
     * Initialize entity model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init(\Magento\PageBuilderDataMigration\Model\ResourceModel\Entity::class);
    }
}
