<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Template;

/**
 * Class Pin
 */
class Pin extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $resultJsonFactory;

    /**
     * @var \Gene\BlueFoot\Model\Stage\TemplateFactory
     */
    protected $template;

    /**
     * Pin constructor.
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
     * @return $this
     */
    public function execute()
    {
        if ($id = $this->getRequest()->getParam('id')) {
            $pinned = filter_var($this->getRequest()->getParam('pinned'), FILTER_VALIDATE_BOOLEAN);
            $template = $this->template->create()->load($id);
            if ($template) {
                try {
                    $template->setData('pinned', $pinned);
                    if ($template->save()) {
                        return $this->resultJsonFactory->create()->setData([
                            'success' => true,
                            'id' => $id,
                            'pinned' => $pinned
                        ]);
                    }
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
