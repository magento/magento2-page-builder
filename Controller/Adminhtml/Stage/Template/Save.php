<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Template;

/**
 * Class Save
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Stage\Widget
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Save extends \Magento\Framework\App\Action\Action
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
     * Allow users to save templates to be rebuilt on the front-end
     *
     * @return $this
     */
    public function execute()
    {
        if ($this->getRequest()->getParam('structure')) {
            $postData = $this->getRequest()->getParams();
            $postData['has_data'] = ($this->getRequest()->getParam('has_data') == 'true' ? 1 : 0);

            $template = $this->_template->create();
            $template->addData($postData);
            if ($template->save()) {
                return $this->_resultJsonFactory->create()->setData(['success' => true]);
            }
        }

        return $this->_resultJsonFactory->create()->setData(['success' => false]);
    }

}