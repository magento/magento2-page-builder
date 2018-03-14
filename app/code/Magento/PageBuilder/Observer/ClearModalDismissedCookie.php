<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Observer;

use Magento\Framework\Stdlib\CookieManagerInterface;
use Magento\Framework\Stdlib\Cookie\CookieMetadataFactory;
use Magento\Framework\Event\ObserverInterface;

class ClearModalDismissedCookie implements ObserverInterface
{
    /**
     * @var CookieManagerInterface
     */
    private $cookieManager;

    /**
     * @var CookieMetadataFactory
     */
    private $cookieMetadata;

    /**
     * ClearModalDismissedCookie constructor.
     *
     * @param CookieManagerInterface $cookieManager
     * @param CookieMetadataFactory $cookieMetadata
     */
    public function __construct(
        CookieManagerInterface $cookieManager,
        CookieMetadataFactory $cookieMetadata
    ) {
        $this->cookieManager = $cookieManager;
        $this->cookieMetadata = $cookieMetadata;
    }

    /**
     * On successful login remove any modal dismissed related cookies
     *
     * @param \Magento\Framework\Event\Observer $observer
     *
     * @throws \Magento\Framework\Exception\InputException
     * @throws \Magento\Framework\Stdlib\Cookie\FailureToSendException
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        $cookieName = "modal_dismissed_pagebuilder_remove";
        if ($this->cookieManager->getCookie($cookieName)) {
            $this->cookieManager->deleteCookie(
                $cookieName,
                $this->cookieMetadata->createCookieMetadata(
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
