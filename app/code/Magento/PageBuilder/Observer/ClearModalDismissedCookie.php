<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Observer;

use Magento\Framework\Stdlib\CookieManagerInterface;
use Magento\Framework\Stdlib\Cookie\CookieMetadataFactory;
use Psr\Log\LoggerInterface;
use Magento\Framework\Event\ObserverInterface;

/**
 * Clear cookies from dismissible modals on login
 *
 * @SuppressWarnings(PHPMD.CookieAndSessionMisuse)
 */
class ClearModalDismissedCookie implements ObserverInterface
{
    /**
     * @var CookieManagerInterface
     */
    private $cookieManager;

    /**
     * @var CookieMetadataFactory
     */
    private $cookieMetadataFactory;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var array
     */
    private $cookieNames;

    /**
     * @param CookieManagerInterface $cookieManager
     * @param CookieMetadataFactory $cookieMetadataFactory
     * @param LoggerInterface $logger
     * @param array $cookieNames
     */
    public function __construct(
        CookieManagerInterface $cookieManager,
        CookieMetadataFactory $cookieMetadataFactory,
        LoggerInterface $logger,
        $cookieNames = []
    ) {
        $this->cookieManager = $cookieManager;
        $this->cookieMetadataFactory = $cookieMetadataFactory;
        $this->logger = $logger;
        $this->cookieNames = $cookieNames;
    }

    /**
     * On successful login remove any modal dismissed related cookies
     *
     * @param \Magento\Framework\Event\Observer $observer
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        try {
            if (count($this->cookieNames) > 0) {
                foreach ($this->cookieNames as $cookieName) {
                    if ($this->cookieManager->getCookie($cookieName)) {
                        $this->cookieManager->deleteCookie(
                            $cookieName,
                            $this->cookieMetadataFactory->createCookieMetadata(
                                [
                                    "path" => "/",
                                    "secure" => false,
                                    "http_only" => false
                                ]
                            )
                        );
                    }
                }
            }
        } catch (\Exception $e) {
            $this->logger->error($e);
        }
    }
}
