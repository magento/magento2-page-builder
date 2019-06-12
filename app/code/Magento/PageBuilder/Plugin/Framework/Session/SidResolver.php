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
     * Get Sid for pagebuilder preview
     *
     * @param \Magento\Framework\Session\SidResolver $subject
     * @param string|null $result
     * @param \Magento\Framework\Session\SessionManagerInterface $session
     *
     * @return string|null
     */
    public function afterGetSid(
        \Magento\Framework\Session\SidResolver $subject,
        $result,
        \Magento\Framework\Session\SessionManagerInterface $session
    ) {
        if (strpos($this->request->getPathInfo(), '/pagebuilder/contenttype/preview') === 0) {
            return $this->request->getQuery(
                $subject->getSessionIdQueryParam($session)
            );
        }

        return $result;
    }
}
