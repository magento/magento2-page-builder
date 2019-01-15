<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilderDataMigration\Model\ResourceModel;

use Magento\Framework\Model\AbstractModel;

/**
 * Class Attribute
 */
class Attribute extends \Magento\Eav\Model\ResourceModel\Entity\Attribute
{
    /**
     * Constructor
     *
     * @param \Magento\Framework\Model\ResourceModel\Db\Context $context
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Eav\Model\ResourceModel\Entity\Type $eavEntityType
     * @param string|null $connectionName
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
     * Validate attribute data before save
     *
     * @param AbstractModel $object
     *
     * @return $this|\Magento\Eav\Model\ResourceModel\Entity\Attribute
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    protected function _beforeSave(AbstractModel $object)
    {
        parent::_beforeSave($object);
        $this->_saveAdditional($object);
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
}
