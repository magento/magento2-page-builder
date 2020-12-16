<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model;

use Magento\Framework\Cache\FrontendInterface;

/**
 * Clean page builder config cache
 */
class EditorConfigCacheCleaner
{
    /**
     * @var FrontendInterface
     */
    private $cache;

    /**
     * @param FrontendInterface $cache
     */
    public function __construct(
        FrontendInterface $cache
    ) {
        $this->cache = $cache;
    }

    /**
     * Clean page builder config cache
     */
    public function execute(): void
    {
        $this->cache->clean();
    }
}
