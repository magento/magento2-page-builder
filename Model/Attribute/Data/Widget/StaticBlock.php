<?php

namespace Gene\BlueFoot\Model\Attribute\Data\Widget;

/**
 * Class StaticBlock
 *
 * @package Gene\BlueFoot\Model\Attribute\Data\Widget
 *
 * @author Hob Adams <hob@gene.co.uk>
 */
class StaticBlock extends \Gene\BlueFoot\Model\Attribute\Data\AbstractWidget implements
    \Gene\BlueFoot\Model\Attribute\Data\WidgetInterface
{

    /**
     * @var \Magento\Framework\ObjectManagerInterface
     */
    protected $_objectManager;

    /**
     * @param \Magento\Framework\Model\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param \Magento\Framework\ObjectManagerInterface $objectManager
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null $resourceCollection
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\ObjectManagerInterface $objectManager,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
        $this->_objectManager = $objectManager;
    }

    /**
     * Return Video data from the given field
     *
     * @return mixed
     */
    public function getBlock()
    {
        $block = $this->_objectManager->create('Magento\Cms\Model\Block');
        return $block->load($this->getEntity()->getData($this->getAttribute()->getData('attribute_code')));
    }


    /**
     * Return an array of basic block data used by the page builder
     *
     * @return array
     */
    public function asJson()
    {
        $block = $this->getBlock();

        return array(
            'title' => $block->getTitle(),
            'identifier' => $block->getIdentifier(),
            'content' => $block->getContent()
        );
    }

}
