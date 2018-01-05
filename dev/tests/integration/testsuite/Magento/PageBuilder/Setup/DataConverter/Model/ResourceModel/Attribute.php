<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter\Model\ResourceModel;

use Magento\Framework\Model\AbstractModel;

class Attribute extends \Magento\Eav\Model\ResourceModel\Entity\Attribute
{
    /**
     * Attribute constructor.
     *
     * @param \Magento\Framework\Model\ResourceModel\Db\Context $context
     * @param \Magento\Store\Model\StoreManagerInterface        $storeManager
     * @param \Magento\Eav\Model\ResourceModel\Entity\Type      $eavEntityType
     * @param null                                              $connectionName
     */
    public function __construct(
        \Magento\Framework\Model\ResourceModel\Db\Context $context,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Eav\Model\ResourceModel\Entity\Type $eavEntityType,
        $connectionName = null
    ) {
        parent::__construct($context, $storeManager, $eavEntityType, $connectionName);
    }

    /**
     * @param AbstractModel $object
     *
     * @return $this
     * @throws \Exception
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    protected function _beforeSave(AbstractModel $object)
    {
        parent::_beforeSave($object);
        $this->_saveAdditional($object);
        $this->_saveInputType($object);
        return $this;
    }

    /**
     * Save additional information
     *
     * @param \Magento\Framework\Model\AbstractModel $object
     *
     * @return $this
     */
    protected function _saveAdditional(AbstractModel $object)
    {
        if ($object->getData('additional')) {
            $object->setAdditionalData(json_encode($object->getData('additional')));
        }

        return $this;
    }

    /**
     * Set various data based on the front-end input type
     *
     * @param \Magento\Framework\Model\AbstractModel $object
     *
     * @return $this
     */
    protected function _saveInputType(AbstractModel $object)
    {
        switch ($object->getFrontendInput()) {
            case 'child_entity':
                $object->setBackendType('text');
                $object->setBackendModel('Magento\Eav\Model\Entity\Attribute\Backend\ArrayBackend');
                $object->setSourceModel('Gene\BlueFoot\Model\Attribute\Source\Entity\Child');
        }

        return $this;
    }
}
