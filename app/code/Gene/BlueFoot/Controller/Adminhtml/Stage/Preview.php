<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Stage;

/**
 * Class Preview
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Preview extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $resultJsonFactory;

    /**
     * @var \Gene\BlueFoot\Model\Stage\Build
     */
    protected $build;

    /**
     * Config constructor.
     *
     * @param \Magento\Backend\App\Action\Context              $context
     * @param \Gene\BlueFoot\Model\Stage\Build                 $build
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Gene\BlueFoot\Model\Stage\Build $build,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
    ) {
        parent::__construct($context);

        $this->build = $build;
        $this->resultJsonFactory = $resultJsonFactory;
    }

    /**
     * Return the systems configuration as a JSON string
     *
     * @return $this
     */
    public function execute()
    {
        if ($this->getRequest()->getParam('code')
            && $this->getRequest()->getParam('data')
            && $this->getRequest()->getParam('fields')
        ) {
            // Build the data model update
            $dataModelUpdates = $this->build->buildDataModelUpdate(
                $this->getRequest()->getParam('code'),
                $this->getRequest()->getParam('data'),
                $this->getRequest()->getParam('fields')
            );

            return $this->resultJsonFactory->create()->setData(array('success' => true, 'fields' => $dataModelUpdates));
        }

        return $this->resultJsonFactory->create()->setData(array('success' => false));
    }
}
