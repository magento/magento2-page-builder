<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Template;

/**
 * Class Index
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Stage\Template
 *
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */
class Index extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $resultJsonFactory;

    /**
     * Index constructor.
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
    ) {
        parent::__construct($context);

        $this->resultJsonFactory = $resultJsonFactory;
    }

    /**
     * Return json array of templates
     *
     * @return \Magento\Framework\Controller\Result\Json
     */
    public function execute()
    {
        return $this->resultJsonFactory->create()->setData([
            'templates' => [
                ['id' => '99', 'label' => 'From ajax'],
                ['id' => '11', 'label' => 'From ajax also'],
                ['id' => '121', 'label' => 'From ajax also']
            ]
        ]);
    }
}