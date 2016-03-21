<?php

namespace Gene\BlueFoot\Model\ResourceModel;

use Magento\Framework\Model\AbstractModel;

/**
 * Class Attribute
 *
 * @package Gene\BlueFoot\Model\ResourceModel
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Attribute extends \Magento\Eav\Model\ResourceModel\Entity\Attribute
{
    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    protected $_configInterface;

    /**
     * Class constructor
     *
     * @param \Magento\Framework\Model\ResourceModel\Db\Context $context
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Eav\Model\ResourceModel\Entity\Type $eavEntityType
     * @param string $connectionName
     * @codeCoverageIgnore
     */
    public function __construct(
        \Magento\Framework\Model\ResourceModel\Db\Context $context,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Eav\Model\ResourceModel\Entity\Type $eavEntityType,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        $connectionName = null
    ) {
        parent::__construct($context, $storeManager, $eavEntityType, $connectionName);
        $this->_configInterface = $configInterface;
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
            if ($widgetInstance = $this->_configInterface->getWidget($widget)) {
                $object->setDataModel((isset($widgetInstance['data_model']) ? $widgetInstance['data_model'] : ''));
                $object->setFrontendInput($widgetInstance['input_type']);
                $object->setWidget($widgetInstance['alias']);
            } else {
                throw new \Exception('Unable to load widget for ' . $widget);
            }
        } else if ($object->getOrigData('widget')) {
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
        if($object->getData('additional')){
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
        switch($object->getFrontendInput()) {
            case 'child_entity':
                $object->setBackendType('text');
                $object->setBackendModel('Magento\Eav\Model\Entity\Attribute\Backend\ArrayBackend');
                $object->setSourceModel('Gene\BlueFoot\Model\Attribute\Source\Entity\Child');
        }

        return $this;
    }

}
