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

    const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps/embed/v1/place?key=%s&q=Austin+TX';

    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    private $resultJsonFactory;

    /**
     * Constructor
     *
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
     * Send test request to Google Maps and return response
     *
     * @return $this|\Magento\Framework\App\ResponseInterface|\Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        $apiKey = $this->getRequest()->getParam('key');
        $testUrl = sprintf(self::GOOGLE_MAPS_EMBED_URL, $apiKey);
        $curl = curl_init($testUrl);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($curl);
        $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $returnArray = [
            'responseCode' => $responseCode,
            'responseMessage' => $responseCode !== 200 ? $result : '',
            'success' => $responseCode === 200 ? true : false
        ];

        return $this->resultJsonFactory->create()->setData($returnArray);
    }
}
