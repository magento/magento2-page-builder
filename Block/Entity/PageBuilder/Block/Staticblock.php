<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder\Block;

/**
 * Class StaticBlock
 *
 * @package Gene\BlueFoot\Block\Entity\PageBuilder\Block
 *
 * @author Hob Adams <hob@gene.co.uk>
 */
class StaticBlock extends AbstractBlock
{

    /**
     * @var \Magento\Framework\ObjectManagerInterface
     */
    protected $_objectManager;

    /**
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Gene\BlueFoot\Model\Stage\Render $render
     * @param \Magento\Framework\Data\CollectionFactory $dataCollectionFactory
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Gene\BlueFoot\Model\Stage\Render $render,
        \Magento\Framework\ObjectManagerInterface $objectManager,
        \Magento\Framework\Data\CollectionFactory $dataCollectionFactory,
        array $data = []
    ) {
        parent::__construct($context, $render, $dataCollectionFactory, $data);
        $this->_objectManager = $objectManager;
    }


    /**
     * @return bool
     */
    public function getBlock()
    {
        /* @var $dataModel \Gene\BlueFoot\Model\Attribute\Data\Widget\StaticBlock */
        $dataModel = $this->getEntity()->getResource()->getAttribute('block_id')->getDataModel($this->getEntity());
        if ($dataModel instanceof \Gene\BlueFoot\Model\Attribute\Data\Widget\StaticBlock && method_exists($dataModel, 'getBlock')) {
            return $dataModel->getBlock();
        }
        return false;
    }
}