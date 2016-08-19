<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Entity;

/**
 * Class Attribute
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Entity
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
abstract class Attribute extends \Magento\Backend\App\Action
{
    /**
     * @var string
     */
    protected $entityTypeId;

    /**
     * @var \Magento\Framework\Registry
     */
    protected $coreRegistry;

    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $resultPageFactory;

    /**
     * Attribute constructor.
     *
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\Framework\View\Result\PageFactory $resultPageFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Registry $coreRegistry,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory
    ) {
        parent::__construct($context);

        $this->coreRegistry = $coreRegistry;
        $this->resultPageFactory = $resultPageFactory;
    }

    /**
     * Dispatch request.
     *
     * @param \Magento\Framework\App\RequestInterface $request
     * @return \Magento\Framework\App\ResponseInterface
     */
    public function dispatch(\Magento\Framework\App\RequestInterface $request)
    {
        $this->entityTypeId = $this->_objectManager->create(
            'Magento\Eav\Model\Entity'
        )->setType(
            \Gene\BlueFoot\Model\Entity::ENTITY
        )->getTypeId();
        return parent::dispatch($request);
    }

    /**
     * @param null $title
     * @return \Magento\Backend\Model\View\Result\Page
     */
    protected function createActionPage($title = null)
    {
        /* @var \Magento\Backend\Model\View\Result\Page $resultPage */
        $resultPage = $this->resultPageFactory->create();
        $resultPage
            ->addBreadcrumb(
                __('BlueFoot'),
                __('BlueFoot')
            )
            ->addBreadcrumb(
                __('Manage Content Attributes'),
                __('Manage Content Attributes')
            )
            ->setActiveMenu('Gene_BlueFoot::attributes');

        if (!empty($title)) {
            $resultPage->addBreadcrumb($title, $title);
        }

        $resultPage->getConfig()->getTitle()->prepend(__('Content Attributes'));
        return $resultPage;
    }

    /**
     * Generate code from label
     *
     * @param string $label
     * @return string
     */
    protected function generateCode($label)
    {
        $code = substr(
            preg_replace(
                '/[^a-z_0-9]/',
                '_',
                $this->_objectManager->create('Magento\Catalog\Model\Product\Url')
                    ->formatUrlKey($label)
            ),
            0,
            30
        );

        $validatorAttrCode = new \Zend_Validate_Regex(
            ['pattern' => '/^[a-z][a-z_0-9]{0,29}[a-z0-9]$/']
        );

        if (!$validatorAttrCode->isValid($code)) {
            $code = 'attr_' . ($code ?: substr(md5(time()), 0, 8));
        }

        return $code;
    }

    /**
     * ACL check
     *
     * @return bool
     */
    protected function _isAllowed()
    {
        return $this->_authorization->isAllowed('Gene_BlueFoot::attributes');
    }
}
