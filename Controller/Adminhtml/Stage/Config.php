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
    protected $_config;

    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $_resultJsonFactory;

    /**
     * @var \Gene\BlueFoot\Model\Stage\Build
     */
    protected $_build;

    /**
     * Config constructor.
     *
     * @param \Magento\Framework\App\Action\Context $context
     * @param \Gene\BlueFoot\Model\Stage\Config     $config
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Gene\BlueFoot\Model\Stage\Config $config,
        \Gene\BlueFoot\Model\Stage\Build $build,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
    ) {
        parent::__construct($context);

        $this->_config = $config;
        $this->_build = $build;
        $this->_resultJsonFactory = $resultJsonFactory;
    }

    /**
     * Return the systems configuration as a JSON string
     *
     * @return $this
     */
    public function execute()
    {
        $config = $this->_config->getConfig();

        // Does the system have any entity ID's?
        if (($entityIds = $this->getRequest()->getParam('entityIds')) && $entityIds != 'false') {
            $config = array_merge($config, array(
                'entities' => $this->_build->getEntityConfig($entityIds)
            ));
        }

        return $this->_resultJsonFactory->create()->setData($config);
    }
}