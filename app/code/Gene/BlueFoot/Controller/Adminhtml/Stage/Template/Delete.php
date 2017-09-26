<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Template;

/**
 * Class Delete
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Stage\Widget
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Delete extends \Magento\Backend\App\Action
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
     * @return $this
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
