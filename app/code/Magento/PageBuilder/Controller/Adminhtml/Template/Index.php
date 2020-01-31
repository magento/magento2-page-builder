<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\Template;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\View\Result\PageFactory;
use Magento\PageBuilder\Model\Config;
use Magento\Framework\Controller\Result\ForwardFactory;

/**
 * Display template grid
 */
class Index extends Action implements HttpGetActionInterface
{
    const ADMIN_RESOURCE = 'Magento_PageBuilder::templates';

    /**
     * @var PageFactory
     */
    private $resultPageFactory;

    /**
     * @var Config
     */
    private $config;

    /**
     * @var ForwardFactory
     */
    private $forwardFactory;

    /**
     * @param Context $context
     * @param PageFactory $resultPageFactory
     * @param Config $config
     * @param ForwardFactory $forwardFactory
     */
    public function __construct(
        Context $context,
        PageFactory $resultPageFactory,
        Config $config,
        ForwardFactory $forwardFactory
    ) {
        parent::__construct($context);
        $this->resultPageFactory = $resultPageFactory;
        $this->config = $config;
        $this->forwardFactory = $forwardFactory;
    }

    /**
     * Load the Manage Templates page
     *
     * @return \Magento\Framework\Controller\AbstractResult
     */
    public function execute()
    {
        if (!$this->config->isEnabled()) {
            return $this->forwardFactory->create()->forward('noroute');
        }

        /** @var \Magento\Backend\Model\View\Result\Page $resultPage */
        $resultPage = $this->resultPageFactory->create();
        $resultPage->setActiveMenu('Magento_PageBuilder::templates');
        $resultPage->addBreadcrumb(__('CMS'), __('CMS'));
        $resultPage->addBreadcrumb(__('Templates'), __('Templates'));
        $resultPage->getConfig()->getTitle()->prepend(__('Templates'));

        return $resultPage;
    }
}
