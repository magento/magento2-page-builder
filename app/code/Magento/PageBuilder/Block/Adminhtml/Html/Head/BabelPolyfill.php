<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block\Adminhtml\Html\Head;

use Magento\Framework\View\Element\Template;

/**
 * Class BabelPolyfill
 *
 * @package Magento\PageBuilder\Block
 */
class BabelPolyfill extends Template
{
    /**
     * Detect if Page Builder is enabled before loading the polyfill
     *
     * @return bool
     */
    public function shouldLoadPolyfill() : bool
    {
        return (bool)$this->_scopeConfig->getValue(
            \Magento\PageBuilder\Model\Config::IS_PAGEBUILDER_ENABLED
        );
    }

    /**
     * Build and return the polyfill static URL
     *
     * @return string
     */
    public function getJsUrl() : string
    {
        return $this->_assetRepo->getUrl("Magento_PageBuilder::js/babel/polyfill.min.js");
    }
}
