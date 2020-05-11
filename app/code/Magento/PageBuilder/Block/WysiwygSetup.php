<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block;

use Magento\Framework\Cache\FrontendInterface;
use Magento\Framework\DataObject;
use Magento\Framework\View\Element\Template;

/**
 * @api
 */
class WysiwygSetup extends Template
{
    private const WYSIWYG_CONFIG_CACHE_ID = 'WYSIWYG_CONFIG';

    /**
     * @var \Magento\Ui\Component\Wysiwyg\ConfigInterface
     */
    private $config;

    /**
     * @var FrontendInterface
     */
    private $cache;

    /**
     * @param Template\Context $context
     * @param \Magento\Ui\Component\Wysiwyg\ConfigInterface $config
     * @param array $data
     * @param FrontendInterface|null $cache
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Ui\Component\Wysiwyg\ConfigInterface $config,
        array $data = [],
        FrontendInterface $cache = null
    ) {
        $this->config = $config;
        $this->cache = $cache ?: \Magento\Framework\App\ObjectManager::getInstance()->get(FrontendInterface::class);
        parent::__construct($context, $data);
    }

    /**
     * Get config for wysiwyg initialization
     *
     * @return string
     */
    public function getConfigJson() : string
    {
        $configJson = $this->cache->load(self::WYSIWYG_CONFIG_CACHE_ID);
        if (!$configJson) {
            $config = $this->config->getConfig();
            if (is_array($config)) {
                $config = new DataObject($config);
            }
            $configJson = $config->toJson();
            $this->cache->save($configJson, self::WYSIWYG_CONFIG_CACHE_ID);
        }

        return $configJson;
    }
}
