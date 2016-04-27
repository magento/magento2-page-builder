<?php

namespace Gene\BlueFoot\Model\ResourceModel\Attribute;

/**
 * Class ContentBlock
 *
 * @package Gene\BlueFoot\Model\ResourceModel\Attribute
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class ContentBlock extends \Magento\Eav\Model\ResourceModel\Entity\Attribute\Set
{
    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Entity
     */
    protected $_entity;

    /**
     * ContentBlock constructor.
     *
     * @param \Magento\Framework\Model\ResourceModel\Db\Context              $context
     * @param \Magento\Eav\Model\ResourceModel\Entity\Attribute\GroupFactory $attrGroupFactory
     * @param \Magento\Eav\Model\Config                                      $eavConfig
     * @param null                                                           $connectionName
     */
    public function __construct(
        \Magento\Framework\Model\ResourceModel\Db\Context $context,
        \Magento\Eav\Model\ResourceModel\Entity\Attribute\GroupFactory $attrGroupFactory,
        \Magento\Eav\Model\Config $eavConfig,
        \Gene\BlueFoot\Model\ResourceModel\Entity $entity,
        $connectionName = null
    ) {
        parent::__construct($context, $attrGroupFactory, $eavConfig, $connectionName);

        $this->_entity = $entity;
    }

    /**
     * During building up the load select add a join for the entity type data
     *
     * @param string                                 $field
     * @param mixed                                  $value
     * @param \Magento\Framework\Model\AbstractModel $object
     *
     * @return \Magento\Framework\DB\Select
     */
    protected function _getLoadSelect($field, $value, $object)
    {
        $select = $this->getConnection()->select()->from($this->getMainTable());
        $select->joinLeft(
            ['entity_type' => $this->getTable('gene_bluefoot_entity_type')],
            'eav_attribute_set.attribute_set_id = entity_type.attribute_set_id',
            '*'
        );

        // If the field isn't directly specifying which table to join on assume the main table
        if (!strpos($field, '.')) {
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
     *
     * @return $this
     */
    protected function _beforeSave(\Magento\Framework\Model\AbstractModel $object)
    {
        if (!$object->getEntityTypeId() && ($entityType = $this->_entity->getEntityType())) {
            $object->setEntityTypeId($entityType->getEntityTypeId());
        }

        return parent::_beforeSave($object);
    }

    /**
     * Copy and presented data over to the entity type table
     *
     * @param \Magento\Framework\Model\AbstractModel $object
     * @return $this
     */
    protected function _afterSave(\Magento\Framework\Model\AbstractModel $object)
    {
        // Build up our data to be updated
        $updateData = [];
        $tableColumns = $this->getConnection()->describeTable($this->getTable('gene_bluefoot_entity_type'));
        foreach ($tableColumns as $key => $data) {
            if ($value = $object->getData($key)) {
                $updateData[$key] = $value;
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