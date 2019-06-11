<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Plugin\Framework\Session;

/**
 * Plugin for SID resolver.
 */
class SidResolver
{
    /**
     * @var \Magento\Framework\App\RequestInterface
     */
    private $request;

    /**
     * @param \Magento\Framework\App\RequestInterface $request
     */
    public function __construct(
        \Magento\Framework\App\RequestInterface $request
    ) {
        $this->request = $request;
    }

    /**
     * @param \Magento\Framework\Session\SidResolver $subject
     * @param \Closure $proceed
     * @param \Magento\Framework\Session\SessionManagerInterface $session
     *
     * @return string|null
     */
    public function aroundGetSid(
        \Magento\Framework\Session\SidResolver $subject,
        \Closure $proceed,
        \Magento\Framework\Session\SessionManagerInterface $session
    ) {
        if (strpos($this->request->getPathInfo(), 'pagebuilder/contenttype/preview')) {
            return $this->request->getQuery(
                $subject->getSessionIdQueryParam($session)
            );
        }

        return $proceed($session);
    }
}
