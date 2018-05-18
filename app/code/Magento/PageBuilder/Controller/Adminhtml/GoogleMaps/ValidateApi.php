<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\GoogleMaps;

class ValidateApi extends \Magento\Backend\App\Action
{
    const ADMIN_RESOURCE = 'Magento_Backend::content';

    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     * @var \Magento\PageBuilder\Model\GoogleMaps\KeyValidator
     */
    private $resultJsonFactory;
    private $keyValidator;

    /**
     * Constructor
     *
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     * @param \Magento\PageBuilder\Model\GoogleMaps\KeyValidator $keyValidator
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Magento\PageBuilder\Model\GoogleMaps\KeyValidator $keyValidator
    ) {
        parent::__construct($context);
        $this->resultJsonFactory = $resultJsonFactory;
        $this->keyValidator = $keyValidator;
    }

    /**
     * Send test request to Google Maps and return response
     *
     * @return \Magento\Framework\App\ResponseInterface|\Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        $apiKey = $this->getRequest()->getParam('key');
        return $this->resultJsonFactory->create()->setData($this->keyValidator->validate($apiKey));
    }
}
