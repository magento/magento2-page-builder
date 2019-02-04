<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\TestModulePageBuilderDataMigration\Model\ResourceModel\Attribute;

class ContentType extends \Magento\Eav\Model\ResourceModel\Entity\Attribute\Set
{
    /**
     * @var \Magento\PageBuilderDataMigration\Model\ResourceModel\Entity
     */
    private $entity;

    /**
     * @param \Magento\Framework\Model\ResourceModel\Db\Context $context
     * @param \Magento\Eav\Model\ResourceModel\Entity\Attribute\GroupFactory $attrGroupFactory
     * @param \Magento\Eav\Model\Config $eavConfig
     * @param \Magento\PageBuilderDataMigration\Model\ResourceModel\Entity $entity
     * @param null $connectionName
     */
    public function __construct(
        \Magento\Framework\Model\ResourceModel\Db\Context $context,
        \Magento\Eav\Model\ResourceModel\Entity\Attribute\GroupFactory $attrGroupFactory,
        \Magento\Eav\Model\Config $eavConfig,
        \Magento\PageBuilderDataMigration\Model\ResourceModel\Entity $entity,
        $connectionName = null
    ) {
        parent::__construct($context, $attrGroupFactory, $eavConfig, $connectionName);

        $this->entity = $entity;
    }

    /**
     * @param string $field
     * @param mixed $value
     * @param \Magento\Framework\Model\AbstractModel $object
     * @return \Magento\Framework\DB\Select
     * @throws \Magento\Framework\Exception\LocalizedException
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    protected function _getLoadSelect($field, $value, $object)
    {
        $select = $this->getConnection()->select()->from($this->getMainTable());
        $select->joinLeft(
            [$this->getTable('entity_type') => $this->getTable('gene_bluefoot_entity_type')],
            sprintf(
                '%s.attribute_set_id = %s.attribute_set_id',
                $this->getTable('eav_attribute_set'),
                $this->getTable('entity_type')
            ),
            '*'
        );

        // If the field isn't directly specifying which table to join on assume the main table
        if (false === strpos($field, '.')) {
            $field = $this->getConnection()->quoteIdentifier(sprintf('%s.%s', $this->getMainTable(), $field));
        } else {
            $field = $this->getConnection()->quoteIdentifier($field);
        }

        $select->where($field . '=?', $value);
        return $select;
    }

    /**
     * Ensure the BlueFoot entity type ID is set on the row
     *
     * @param \Magento\Framework\Model\AbstractModel $object
     * @return $this
     */
    protected function _beforeSave(\Magento\Framework\Model\AbstractModel $object)
    {
        if (!$object->getEntityTypeId() && ($entityType = $this->entity->getEntityType())) {
            $object->setEntityTypeId($entityType->getEntityTypeId());
        }

        return parent::_beforeSave($object);
    }

    /**
     * Copy and presented data over to the entity type table
     *
     * @param \Magento\Framework\Model\AbstractModel $object
     * @return $this
     *
     * @SuppressWarnings(PHPMD.UnusedLocalVariable)
     */
    protected function _afterSave(\Magento\Framework\Model\AbstractModel $object)
    {
        // Build up our data to be updated
        $updateData = [];
        $tableColumns = $this->getConnection()->describeTable($this->getTable('gene_bluefoot_entity_type'));
        $objectData = $object->getData();
        foreach ($tableColumns as $key => $data) {
            if (array_key_exists($key, $objectData)) {
                $updateData[$key] = $object->getData($key);
            }
        }

        // Force remove the type_id, add the attribute_set_id
        unset($updateData['type_id']);
        $updateData['attribute_set_id'] = $object->getAttributeSetId();
        $updateData['name'] = $object->getAttributeSetName();

        // Insert on duplicate
        $this->getConnection()->insertOnDuplicate(
            $this->getTable('gene_bluefoot_entity_type'),
            $updateData
        );

        return parent::_afterSave($object);
    }
}
