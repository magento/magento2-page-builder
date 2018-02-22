<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;

class Config extends \Magento\Framework\Config\Data implements \Magento\PageBuilder\Model\Config\ConfigInterface
{
    const IS_PAGEBUILDER_ENABLED = 'cms/pagebuilder/enabled';

    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * Config constructor.
     * @param Config\Reader $reader
     * @param \Magento\Framework\Config\CacheInterface $cache
     * @param ScopeConfigInterface $scopeConfig
     * @param string $cacheId
     */
    public function __construct(
        \Magento\PageBuilder\Model\Config\Reader $reader,
        \Magento\Framework\Config\CacheInterface $cache,
        ScopeConfigInterface $scopeConfig,
        $cacheId = 'gene_bluefoot_content_types'
    ) {
        $this->scopeConfig = $scopeConfig;
        parent::__construct($reader, $cache, $cacheId);
    }

    /**
     * @return array
     */
    public function getGroups()
    {
        return $this->get('groups');
    }

    /**
     * @param string $name
     * @return array
     */
    public function getGroup($name)
    {
        return $this->get('groups/' . $name);
    }

    /**
     * Return all content blocks
     *
     * @return array|mixed|null
     */
    public function getContentTypes()
    {
        return $this->get('types');
    }

    /**
     * Return a specific content block by it's identifier
     *
     * @param $name
     * @return array|mixed|null
     */
    public function getContentType($name)
    {
        return $this->get('types/' . $name);
    }

    /**
     * Returns config setting if page builder enabled
     *
     * @return int
     */
    public function isEnabled()
    {
        return (int)$this->scopeConfig->getValue(
            \Magento\PageBuilder\Model\Config::IS_PAGEBUILDER_ENABLED
        );
    }
}
