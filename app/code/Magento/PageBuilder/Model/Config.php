<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;

/**
 * Represents PageBuilder loaded and cached configuration data
 */
class Config extends \Magento\Framework\Config\Data implements \Magento\PageBuilder\Model\ConfigInterface
{
    const IS_PAGEBUILDER_ENABLED = 'cms/pagebuilder/enabled';

    private const IS_PAGEBUILDER_CONTENT_PREVIEW_ENABLED = 'cms/pagebuilder/enable_content_preview';

    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * @param \Magento\PageBuilder\Model\Config\CompositeReader $reader
     * @param \Magento\Framework\Config\CacheInterface $cache
     * @param ScopeConfigInterface $scopeConfig
     * @param string $cacheId
     */
    public function __construct(
        \Magento\PageBuilder\Model\Config\CompositeReader $reader,
        \Magento\Framework\Config\CacheInterface $cache,
        ScopeConfigInterface $scopeConfig,
        $cacheId = 'pagebuilder_config'
    ) {
        $this->scopeConfig = $scopeConfig;
        parent::__construct($reader, $cache, $cacheId);
    }

    /**
     * Return all menu sections
     *
     * @return array
     */
    public function getMenuSections() : array
    {
        return $this->get('menu_sections');
    }

    /**
     * Return all content types
     *
     * @return array
     */
    public function getContentTypes(): array
    {
        return $this->get('types');
    }

    /**
     * Returns config setting if page builder enabled
     *
     * @return bool
     */
    public function isEnabled(): bool
    {
        return (bool)$this->scopeConfig->getValue(
            self::IS_PAGEBUILDER_ENABLED
        );
    }

    /**
     * Returns Configuration Setting for Page Builder Content Preview
     *
     * @return bool
     */
    public function isContentPreviewEnabled(): bool
    {
        return (bool) $this->scopeConfig->getValue(
            self::IS_PAGEBUILDER_CONTENT_PREVIEW_ENABLED
        );
    }
}
