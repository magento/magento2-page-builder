<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Model\ResourceModel;

use Magento\Framework\Model\AbstractModel;

class Attribute extends \Magento\Eav\Model\ResourceModel\Entity\Attribute
{
    /**
     * @var \Magento\PageBuilder\Model\ConfigInterface
     */
    private $configInterface;

    /**
     * Constructor
     *
     * @param \Magento\Framework\Model\ResourceModel\Db\Context $context
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Eav\Model\ResourceModel\Entity\Type $eavEntityType
     * @param \Magento\PageBuilder\Model\ConfigInterface $configInterface
     * @param string|null $connectionName
     */
    public function __construct(
        \Magento\Framework\Model\ResourceModel\Db\Context $context,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Eav\Model\ResourceModel\Entity\Type $eavEntityType,
        \Magento\PageBuilder\Model\ConfigInterface $configInterface,
        $connectionName = null
    ) {
        $this->configInterface = $configInterface;
        parent::__construct($context, $storeManager, $eavEntityType, $connectionName);
    }

    /**
     * Validate attribute data before save
     *
     * @param EntityAttribute|AbstractModel $object
     * @return $this
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
