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
     * @param Template\Context $context
     * @param \Magento\PageBuilder\Model\ConfigInterface $config
     * @param array $data
     */
    public function __construct(
        Template\Context $context,
        \Magento\PageBuilder\Model\ConfigInterface $config,
        array $data = []
    ) {
        $this->config = $config;
        parent::__construct($context, $data);
    }

    /**
     * Detect if Page Builder is enabled before loading the polyfill
     *
     * @return bool
     */
    public function shouldLoadPolyfill() : bool
    {
        return $this->config->isEnabled();
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
}
