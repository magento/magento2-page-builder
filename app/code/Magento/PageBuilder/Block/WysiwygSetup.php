<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\Cache\FrontendInterface;
use Magento\Framework\DataObject;
use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Magento\PageBuilder\Model\Session\RandomKey;
use Magento\Ui\Component\Wysiwyg\ConfigInterface;

/**
 * @api
 */
class WysiwygSetup extends Template
{
    private const WYSIWYG_CONFIG_CACHE_ID = 'WYSIWYG_CONFIG';

    /**
     * @var ConfigInterface
     */
    private $config;

    /**
     * @var FrontendInterface
     */
    private $cache;

    /**
     * @var RandomKey
     */
    private $sessionRandomKey;

    /**
     * @param Context $context
     * @param ConfigInterface $config
     * @param array $data
     * @param FrontendInterface|null $cache
     * @param RandomKey|null $sessionRandomKey
     */
    public function __construct(
        Context $context,
        ConfigInterface $config,
        array $data = [],
        FrontendInterface $cache = null,
        ?RandomKey $sessionRandomKey = null
    ) {
        $this->config = $config;
        $this->cache = $cache ?: ObjectManager::getInstance()->get(FrontendInterface::class);
        $this->sessionRandomKey = $sessionRandomKey
            ?: ObjectManager::getInstance()->get(RandomKey::class);
        parent::__construct($context, $data);
    }

    /**
     * Get config for wysiwyg initialization
     *
     * @return string
     */
    public function getConfigJson() : string
    {
        $cacheKey = self::WYSIWYG_CONFIG_CACHE_ID;
        if ($this->_urlBuilder->useSecretKey()) {
            $cacheKey .= '_' . $this->sessionRandomKey->getValue();
        }
        $configJson = $this->cache->load($cacheKey);
        if (!$configJson) {
            $config = $this->config->getConfig();
            if (is_array($config)) {
                $config = new DataObject($config);
            }
            $configJson = $config->toJson();
            $this->cache->save($configJson, $cacheKey);
        }

        return $configJson;
    }
}
