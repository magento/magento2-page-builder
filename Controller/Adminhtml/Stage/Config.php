<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Stage;

/**
 * Class Config
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Config extends \Magento\Backend\App\Action
{
    /**
     * @var \Gene\BlueFoot\Model\Stage\Config
     */
    protected $config;

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
     * @param \Gene\BlueFoot\Model\Stage\Config                $config
     * @param \Gene\BlueFoot\Model\Stage\Build                 $build
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Gene\BlueFoot\Model\Stage\Config $config,
        \Gene\BlueFoot\Model\Stage\Build $build,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
    ) {
        parent::__construct($context);

        $this->config = $config;
        $this->build = $build;
        $this->resultJsonFactory = $resultJsonFactory;
    }

    /**
     * Return the systems configuration as a JSON string
     *
     * @return \Magento\Framework\Controller\Result\Json
     */
    public function execute()
    {
        // Does the system have any entity ID's?
        if (($entityIds = $this->getRequest()->getParam('entityIds')) && $entityIds != 'false') {
            return $this->resultJsonFactory->create()->setData(
                $this->build->getEntityConfig($entityIds)
            );
        }
    }
}
