<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Template;

/**
 * Class Pin
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Stage\Widget
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Pin extends \Magento\Framework\App\Action\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $_resultJsonFactory;

    /**
     * @var \Gene\BlueFoot\Model\Stage\TemplateFactory
     */
    protected $_template;

    /**
     * Save constructor.
     *
     * @param \Magento\Framework\App\Action\Context            $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     * @param \Gene\BlueFoot\Model\Stage\TemplateFactory       $templateFactory
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Gene\BlueFoot\Model\Stage\TemplateFactory $templateFactory
    ) {
        parent::__construct($context);

        $this->_resultJsonFactory = $resultJsonFactory;
        $this->_template = $templateFactory;
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
            $template = $this->_template->create()->load($id);
            if ($template) {
                try {
                    $template->setData('pinned', $pinned);
                    if ($template->save()) {
                        return $this->_resultJsonFactory->create()->setData(['success' => true, 'id' => $id, 'pinned' => $pinned]);
                    }
                } catch (\Exception $e) {
                    return $this->_resultJsonFactory->create()->setData(['success' => false, 'exception' => $e->getMessage()]);
                }
            }
        }

        return $this->_resultJsonFactory->create()->setData(['success' => false]);
    }

}