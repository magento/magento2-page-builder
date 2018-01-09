<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\ResourceModel;

/**
 * Class Entity
 */
class Entity extends \Magento\Eav\Model\Entity\VersionControl\AbstractEntity
{
    /**
     * Entity constructor.
     *
     * @param \Magento\Eav\Model\Entity\Context                                          $context
     * @param \Magento\Framework\Model\ResourceModel\Db\VersionControl\Snapshot          $entitySnapshot
     * @param \Magento\Framework\Model\ResourceModel\Db\VersionControl\RelationComposite $entityRelationComposite
     * @param array                                                                      $data
     */
    public function __construct(
        \Magento\Eav\Model\Entity\Context $context,
        \Magento\Framework\Model\ResourceModel\Db\VersionControl\Snapshot $entitySnapshot,
        \Magento\Framework\Model\ResourceModel\Db\VersionControl\RelationComposite $entityRelationComposite,
        $data = []
    ) {
        parent::__construct($context, $entitySnapshot, $entityRelationComposite, $data);
        $this->setConnection('gene_bluefoot_entity_read', 'gene_bluefoot_entity_write');
    }

    /**
     * Re-declare attribute model
     *
     * @return string
     */
    protected function _getDefaultAttributeModel()
    {
        return \Gene\BlueFoot\Model\ResourceModel\Attribute::class;
    }

    /**
     * Returns default Store ID
     *
     * @return int
     */
    public function getDefaultStoreId()
    {
        return \Magento\Store\Model\Store::DEFAULT_STORE_ID;
    }

    /**
     * Entity type getter and lazy loader
     *
     * @return \Magento\Eav\Model\Entity\Type
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function getEntityType()
    {
        if (empty($this->_type)) {
            $this->setType(\Gene\BlueFoot\Model\Entity::ENTITY);
        }
        return parent::getEntityType();
    }

    /**
     * @return string
     */
    public function getMainTable()
    {
        return \Gene\BlueFoot\Model\Entity::ENTITY;
    }
}
