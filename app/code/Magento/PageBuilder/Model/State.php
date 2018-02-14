<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */


namespace Magento\PageBuilder\Model;

class State
{
    /**
     * @var \Magento\PageBuilder\Model\Config
     */
    private $config;

    /**
     * State constructor.
     * @param Config $config
     */
    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    /**
     * Returns information if use page builder based on system configuration and xml configuration
     * @param $isPageBuilderUsed
     * @return bool
     */
    public function isPageBuilderInUse($isPageBuilderUsed)
    {
        return $isPageBuilderUsed || !$this->config->isEnabled();
    }
}
