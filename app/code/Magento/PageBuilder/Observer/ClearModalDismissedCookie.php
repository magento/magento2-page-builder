<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Observer;

use Magento\Framework\Stdlib\CookieManagerInterface;
use Magento\Framework\Stdlib\Cookie\CookieMetadataFactory;
use Magento\Framework\Message\ManagerInterface;
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
    private $cookieMetadataFactory;

    /**
     * @var ManagerInterface
     */
    private $messageManager;

    /**
     * ClearModalDismissedCookie constructor.
     *
     * @param CookieManagerInterface $cookieManager
     * @param CookieMetadataFactory $cookieMetadataFactory
     * @param ManagerInterface $messageManager
     */
    public function __construct(
        CookieManagerInterface $cookieManager,
        CookieMetadataFactory $cookieMetadataFactory,
        ManagerInterface $messageManager
    ) {
        $this->cookieManager = $cookieManager;
        $this->cookieMetadataFactory = $cookieMetadataFactory;
        $this->messageManager = $messageManager
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
            $cookieName = "pagebuilder_modal_dismissed";
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
        } catch (\Magento\Framework\Exception\LocalizedException $e) {
            $this->messageManager->addError($e->getMessage());
        } catch (\Exception $e) {
            $this->messageManager->addException($e, __('Load customer quote error'));
        }
    }
}
