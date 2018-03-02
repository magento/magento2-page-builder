<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Observer;

use Magento\Framework\Stdlib\CookieManagerInterface;
use Magento\Framework\Stdlib\Cookie\CookieMetadataFactory;
use Magento\Framework\Event\ObserverInterface;

class ClearModalDismissedCookie implements ObserverInterface
{
    const MODAL_DISMISSED_PREFIX = "modal_dismissed_";

    /**
     * @var CookieManagerInterface
     */
    private $cookieManager;

    /**
     * @var CookieMetadataFactory
     */
    private $cookieMetadata;

    /**
     * @var array
     */
    private $cookieNames;

    /**
     * ClearModalDismissedCookie constructor.
     *
     * @param CookieManagerInterface $cookieManager
     * @param CookieMetadataFactory $cookieMetadata
     * @param array $cookieNames
     */
    public function __construct(
        CookieManagerInterface $cookieManager,
        CookieMetadataFactory $cookieMetadata,
        $cookieNames = []
    ) {
        $this->cookieManager = $cookieManager;
        $this->cookieMetadata = $cookieMetadata;
        $this->cookieNames = $cookieNames;
    }

    /**
     * On successful login remove any modal dismissed related cookies
     *
     * @param \Magento\Framework\Event\Observer $observer
     *
     * @throws \Magento\Framework\Exception\InputException
     * @throws \Magento\Framework\Stdlib\Cookie\FailureToSendException
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        foreach ($this->cookieNames as $cookieName) {
            if ($this->cookieManager->getCookie(self::MODAL_DISMISSED_PREFIX . $cookieName)) {
                $this->cookieManager->deleteCookie(
                    self::MODAL_DISMISSED_PREFIX . $cookieName,
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
}
