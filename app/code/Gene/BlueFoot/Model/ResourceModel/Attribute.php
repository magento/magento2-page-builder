<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\ResourceModel;

use Magento\Framework\Model\AbstractModel;

class Attribute extends \Magento\Eav\Model\ResourceModel\Entity\Attribute
{
    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    private $configInterface;

    /**
     * Constructor
     *
     * @param \Magento\Framework\Model\ResourceModel\Db\Context $context
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Eav\Model\ResourceModel\Entity\Type $eavEntityType
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface
     * @param string|null $connectionName
     */
    public function __construct(
        \Magento\Framework\Model\ResourceModel\Db\Context $context,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Eav\Model\ResourceModel\Entity\Type $eavEntityType,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        $connectionName = null
    ) {
        parent::__construct($context, $storeManager, $eavEntityType, $connectionName);
        $this->configInterface = $configInterface;
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
        $this->_saveWidget($object);
        $this->_saveAdditional($object);
        $this->_saveInputType($object);
        return $this;
    }

    /**
     * Save a widget against an attribute
     *
     * @param \Magento\Framework\Model\AbstractModel $object
     *
     * @return $this
     * @throws \Exception
     */
    protected function _saveWidget(AbstractModel $object)
    {
        if ($widget = $object->getWidget()) {
            if ($widgetInstance = $this->configInterface->getWidget($widget)) {
                $object->setDataModel((isset($widgetInstance['data_model']) ? $widgetInstance['data_model'] : ''));
                $object->setFrontendInput($widgetInstance['input_type']);
                $object->setWidget($widgetInstance['alias']);
            } else {
                throw new \Exception('Unable to load widget for ' . $widget);
            }
        } elseif ($object->getOrigData('widget')) {
            $object->setDataModel('');
        }

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
                $object->setBackendModel(\Magento\Eav\Model\Entity\Attribute\Backend\ArrayBackend::class);
        }

        return $this;
    }
}
