<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Model;

class Config extends \Magento\Framework\Config\Data implements \Magento\PageBuilder\Model\Config\ConfigInterface
{
    /**
     * Constructor
     *
     * @param \Magento\PageBuilder\Model\Config\Reader $reader
     * @param \Magento\Framework\Config\CacheInterface $cache
     * @param string $cacheId
     */
    public function __construct(
        \Magento\PageBuilder\Model\Config\Reader $reader,
        \Magento\Framework\Config\CacheInterface $cache,
        $cacheId = 'gene_pagebuilder_content_types'
    ) {
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
}
