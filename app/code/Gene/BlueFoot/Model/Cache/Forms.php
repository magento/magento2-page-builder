<?php

namespace Gene\BlueFoot\Model\Cache;

/**
 * Class Forms
 *
 * @package Gene\BlueFoot\Model\Cache
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Forms extends \Magento\Framework\Cache\Frontend\Decorator\TagScope
{
    /**
     * Cache type code unique among all cache types
     */
    const TYPE_IDENTIFIER = 'bluefoot_forms_cache';

    /**
     * Cache tag used to distinguish the cache type from all other cache
     */
    const CACHE_TAG = 'BLUEFOOT_FORMS';

    /**
     * @param \Magento\Framework\App\Cache\Type\FrontendPool $cacheFrontendPool
     */
    public function __construct(\Magento\Framework\App\Cache\Type\FrontendPool $cacheFrontendPool)
    {
        parent::__construct($cacheFrontendPool->get(self::TYPE_IDENTIFIER), self::CACHE_TAG);
    }
}
