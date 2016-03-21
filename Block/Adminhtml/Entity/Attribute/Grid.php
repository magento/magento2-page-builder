<?php

namespace Gene\BlueFoot\Block\Adminhtml\Entity\Attribute;

use Magento\Eav\Block\Adminhtml\Attribute\Grid\AbstractGrid;

/**
 * Class Grid
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\Attribute
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Grid extends AbstractGrid
{
    /**
     * @var \Magento\Catalog\Model\ResourceModel\Product\Attribute\CollectionFactory
     */
    protected $_collectionFactory;

    /**
     * @param \Magento\Backend\Block\Template\Context $context
     * @param \Magento\Backend\Helper\Data $backendHelper
     * @param \Gene\BlueFoot\Model\ResourceModel\Attribute\CollectionFactory $collectionFactory
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Backend\Helper\Data $backendHelper,
        \Gene\BlueFoot\Model\ResourceModel\Attribute\CollectionFactory $collectionFactory,
        array $data = []
    ) {
        $this->_collectionFactory = $collectionFactory;
        $this->_module = 'bluefoot';
        parent::__construct($context, $backendHelper, $data);
    }

    /**
     * Prepare product attributes grid collection object
     *
     * @return $this
     */
    protected function _prepareCollection()
    {
        $collection = $this->_collectionFactory->create();
        $this->setCollection($collection);

        return parent::_prepareCollection();
    }

    /**
     * Prepare product attributes grid columns
     *
     * @return $this
     */
    protected function _prepareColumns()
    {
        $this->addColumn(
            'attribute_id',
            [
                'header' => __('Attribute ID'),
                'sortable' => true,
                'index' => 'attribute_id',
                'type' => 'int',
                'width' => '50'
            ]
        );

        $this->addColumn(
            'frontend_input',
            [
                'header' => __('Input Type'),
                'sortable' => true,
                'index' => 'frontend_input',
                'type' => 'text'
            ]
        );

        $this->addColumn(
            'widget',
            [
                'header' => __('Widget'),
                'sortable' => true,
                'index' => 'widget',
                'type' => 'text'
            ]
        );

        parent::_prepareColumns();

        $this->addColumnAfter(
            'is_global',
            [
                'header' => __('Scope'),
                'sortable' => true,
                'index' => 'is_global',
                'type' => 'options',
                'options' => [
                    \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE => __('Store View'),
                    \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_WEBSITE => __('Web Site'),
                    \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_GLOBAL => __('Global'),
                ],
                'align' => 'center'
            ],
            'system'
        );

        return $this;
    }
}
