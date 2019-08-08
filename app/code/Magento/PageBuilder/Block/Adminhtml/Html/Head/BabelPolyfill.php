<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block\Adminhtml\Html\Head;

use Magento\Framework\View\Element\Template;

/**
 * Babel polyfill is required for IE 11 compatibility
 *
 * @api
 */
class BabelPolyfill extends Template
{
    /**
     * @var \Magento\PageBuilder\Model\ConfigInterface
     */
    private $config;

    /**
     * @var \Magento\Framework\HTTP\Header
     */
    private $httpHeader;

    /**
     * @param Template\Context $context
     * @param \Magento\PageBuilder\Model\ConfigInterface $config
     * @param \Magento\Framework\HTTP\Header $httpHeader
     * @param array $data
     */
    public function __construct(
        Template\Context $context,
        \Magento\PageBuilder\Model\ConfigInterface $config,
        \Magento\Framework\HTTP\Header $httpHeader,
        array $data = []
    ) {
        $this->config = $config;
        $this->httpHeader = $httpHeader;
        parent::__construct($context, $data);
    }

    /**
     * Detect if Page Builder is enabled and the user is loading the website from IE 11
     *
     * @return bool
     */
    public function shouldLoadPolyfill() : bool
    {
        return $this->config->isEnabled() && $this->isIe11();
    }

    /**
     * Build and return the polyfill static URL
     *
     * @return string
     */
    public function getJsUrl() : string
    {
        return $this->_assetRepo->getUrl("Magento_PageBuilder::js/resource/babel/polyfill.min.js");
    }

    /**
     * Extend the cache keys with a IE 11 flag
     *
     * @return array
     */
    public function getCacheKeyInfo() : array
    {
        $cacheKeys = parent::getCacheKeyInfo();
        $cacheKeys['is_ie11'] = $this->isIe11();
        return $cacheKeys;
    }

    /**
     * Detect if the browser user agent contains the IE 11 user agent
     *
     * @return bool
     */
    private function isIe11() : bool
    {
        return strpos($this->httpHeader->getHttpUserAgent(), 'rv:11.0') !== false
            && strpos($this->httpHeader->getHttpUserAgent(), 'Trident/7.0;') !== false;
    }
}
