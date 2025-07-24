<?php
/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

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
     *
     * @param mixed $isPageBuilderUsed
     * @return bool
     */
    public function isPageBuilderInUse($isPageBuilderUsed) : bool
    {
        return $isPageBuilderUsed || !$this->config->isEnabled();
    }
}
