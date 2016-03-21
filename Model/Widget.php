<?php

namespace Gene\BlueFoot\Model;

/**
 * Class Widget
 *
 * @package Gene\BlueFoot\Model
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Widget extends \Magento\Framework\Model\AbstractModel
{
    /**
     * Declare the default group for all widgets
     */
    const DEFAULT_GROUP = 'Blue Foot';

    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    protected $_configInterface;

    /**
     * @param \Magento\Framework\Model\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb $resourceCollection
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);

        $this->_configInterface = $configInterface;
    }

    /**
     * Return the widgets as an option array
     *
     * @return array
     */
    public function toOptionArray()
    {
        $widgets = $this->_configInterface->getWidgets();

        $groups = [];
        foreach ($widgets as $widget) {
            $groups[(isset($widget['group']) ? $widget['group'] : self::DEFAULT_GROUP)][] = [
                'label' => $widget['label'],
                'value' => $widget['alias']
            ];
        }

        $optionArray = [[
            'label' => __('None'),
            'value' => ''
        ]];

        foreach ($groups as $groupName => $values) {
            $optionArray[] = [
                'label' => $groupName,
                'value' => $values
            ];
        }

        return $optionArray;
    }
}