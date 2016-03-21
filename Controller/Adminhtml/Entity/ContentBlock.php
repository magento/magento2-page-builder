<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Entity;

/**
 * Class ContentBlock
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Entity
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
abstract class ContentBlock extends \Magento\Backend\App\Action
{
    /**
     * Core registry
     *
     * @var \Magento\Framework\Registry
     */
    protected $_coreRegistry;

    /**
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\Framework\Registry $coreRegistry
     */
    public function __construct(\Magento\Backend\App\Action\Context $context, \Magento\Framework\Registry $coreRegistry)
    {
        $this->_coreRegistry = $coreRegistry;
        parent::__construct($context);
    }

    /**
     * Define in register catalog_product entity type code as entityType
     *
     * @return void
     */
    protected function _setTypeId()
    {
        $this->_coreRegistry->register(
            'entityType',
            $this->_objectManager->create('Gene\BlueFoot\Model\Entity')->getResource()->getTypeId()
        );
    }

    /**
     * @return bool
     */
    protected function _isAllowed()
    {
        return $this->_authorization->isAllowed('Gene_BlueFoot::blocks');
    }
}
