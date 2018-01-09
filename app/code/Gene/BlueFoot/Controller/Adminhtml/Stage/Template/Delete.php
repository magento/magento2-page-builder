<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Template;

/**
 * Class Delete
 */
class Delete extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    private $resultJsonFactory;

    /**
     * @var \Gene\BlueFoot\Model\Stage\TemplateFactory
     */
    private $template;

    /**
     * Delete constructor.
     *
     * @param \Magento\Backend\App\Action\Context              $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     * @param \Gene\BlueFoot\Model\Stage\TemplateFactory       $templateFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Gene\BlueFoot\Model\Stage\TemplateFactory $templateFactory
    ) {
        parent::__construct($context);

        $this->resultJsonFactory = $resultJsonFactory;
        $this->template = $templateFactory;
    }

    /**
     * Allow a user to delete a template
     *
     * @return \Magento\Framework\Controller\Result\Json
     */
    public function execute()
    {
        if ($id = $this->getRequest()->getParam('id')) {
            $template = $this->template->create()->load($id);
            if ($template) {
                try {
                    $template->delete();
                    return $this->resultJsonFactory->create()->setData(['success' => true]);
                } catch (\Exception $e) {
                    return $this->resultJsonFactory->create()->setData([
                        'success' => false,
                        'exception' => $e->getMessage()
                    ]);
                }
            }
        }

        return $this->resultJsonFactory->create()->setData(['success' => false]);
    }
}
