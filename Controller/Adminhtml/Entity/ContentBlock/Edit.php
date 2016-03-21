<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Entity\ContentBlock;

/**
 * Class Edit
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Entity\ContentBlock
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Edit extends \Gene\BlueFoot\Controller\Adminhtml\Entity\ContentBlock
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
        $this->_setTypeId();
        $attributeSet = $this->_objectManager->create('Gene\BlueFoot\Model\Attribute\ContentBlock')
            ->load($this->getRequest()->getParam('id'));

        if (!$attributeSet->getId()) {
            return $this->resultRedirectFactory->create()->setPath('bluefoot/*/index');
        }

        $this->_coreRegistry->register('current_attribute_set', $attributeSet);

        /** @var \Magento\Backend\Model\View\Result\Page $resultPage */
        $resultPage = $this->resultPageFactory->create();
        $resultPage->setActiveMenu('Gene_BlueFoot::blocks');
        $resultPage->getConfig()->getTitle()->prepend(__('Content Blocks'));
        $resultPage->getConfig()->getTitle()->prepend(
            $attributeSet->getId() ? $attributeSet->getAttributeSetName() : __('New Content Block')
        );
        $resultPage->addBreadcrumb(__('BlueFoot'), __('BlueFoot'));
        $resultPage->addBreadcrumb(__('Manage Content Blocks'), __('Manage Content Blocks'));
        return $resultPage;
    }
}
