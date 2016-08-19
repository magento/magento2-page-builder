<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Entity\ContentBlock;

/**
 * Class Index
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Entity\ContentBlock
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Index extends \Gene\BlueFoot\Controller\Adminhtml\Entity\ContentBlock
{
    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $resultPageFactory;

    /**
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\Framework\Registry $coreRegistry
     * @param \Magento\Framework\View\Result\PageFactory $resultPageFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Registry $coreRegistry,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory
    ) {
        parent::__construct($context, $coreRegistry);
        $this->resultPageFactory = $resultPageFactory;
    }

    /**
     * @return \Magento\Backend\Model\View\Result\Page
     */
    public function execute()
    {
        $this->setTypeId();

        /* @var \Magento\Backend\Model\View\Result\Page $resultPage */
        $resultPage = $this->resultPageFactory->create();
        $resultPage->setActiveMenu('Gene_BlueFoot::blocks');
        $resultPage->getConfig()->getTitle()->prepend(__('Page Builder Blocks'));
        $resultPage->addBreadcrumb(__('BlueFoot'), __('BlueFoot'));
        $resultPage->addBreadcrumb(
            __('Manage Page Builder Blocks'),
            __('Page Builder Blocks')
        );
        return $resultPage;
    }
}
