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
        $cacheId = 'gene_bluefoot_pagebuilder'
    ) {
        parent::__construct($reader, $cache, $cacheId);
    }

    /**
     * Return all content blocks
     *
     * @return array|mixed|null
     */
    public function getContentBlocks()
    {
        return $this->get('content_blocks');
    }

    /**
     * Return a specific content block by it's identifier
     *
     * @param $identifier
     *
     * @return array|mixed|null
     */
    public function getContentBlock($identifier)
    {
        return $this->get('content_blocks/' . $identifier);
    }

    /**
     * Return the defined global fields
     *
     * @return array|mixed|null
     */
    public function getGlobalFields()
    {
        return $this->get('global_fields');
    }
}
