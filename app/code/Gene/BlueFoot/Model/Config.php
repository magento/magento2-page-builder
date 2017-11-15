<?php

namespace Gene\BlueFoot\Model;

/**
 * Class Config
 *
 * @package Gene\BlueFoot\Model
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Config extends \Magento\Framework\Config\Data implements \Gene\BlueFoot\Model\Config\ConfigInterface
{
    /**
     * Config constructor.
     *
     * @param \Gene\BlueFoot\Model\Config\Reader       $reader
     * @param \Magento\Framework\Config\CacheInterface $cache
     * @param string                                   $cacheId
     */
    public function __construct(
        \Gene\BlueFoot\Model\Config\Reader $reader,
        \Magento\Framework\Config\CacheInterface $cache,
        $cacheId = 'gene_bluefoot_content_types'
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
     *
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
     *
     * @return array|mixed|null
     */
    public function getContentType($name)
    {
        return $this->get('types/' . $name);
    }
}
