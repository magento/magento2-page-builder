<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Entity\ContentBlock;

/**
 * Class SetGrid
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Entity\ContentBlock
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class SetGrid extends \Gene\BlueFoot\Controller\Adminhtml\Entity\ContentBlock
{
    /**
     * @var \Magento\Framework\View\Result\LayoutFactory
     */
    protected $resultLayoutFactory;

    /**
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\Framework\Registry $coreRegistry
     * @param \Magento\Framework\View\Result\LayoutFactory $resultLayoutFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Registry $coreRegistry,
        \Magento\Framework\View\Result\LayoutFactory $resultLayoutFactory
    ) {
        parent::__construct($context, $coreRegistry);
        $this->resultLayoutFactory = $resultLayoutFactory;
    }

    /**
     * @return \Magento\Framework\View\Result\Layout
     */
    public function execute()
    {
        $this->_setTypeId();
        return $this->resultLayoutFactory->create();
    }
}
