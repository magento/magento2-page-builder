<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Plugin;

use Magento\Backend\Model\UrlInterface;
use Magento\PageBuilder\Model\EditorConfigCacheCleaner;

/**
 * Clear page builder editor config cache after login
 */
class ClearEditorConfigCache
{
    /**
     * @var EditorConfigCacheCleaner
     */
    private $cacheCleaner;

    /**
     * @var UrlInterface
     */
    private $backendUrl;

    /**
     * @param UrlInterface $backendUrl
     * @param EditorConfigCacheCleaner $cacheCleaner
     */
    public function __construct(
        UrlInterface $backendUrl,
        EditorConfigCacheCleaner $cacheCleaner
    ) {
        $this->cacheCleaner = $cacheCleaner;
        $this->backendUrl = $backendUrl;
    }

    /**
     * Clear page builder editor config cache after login
     *
     * @param \Magento\Backend\Model\Auth $subject
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterLogin(\Magento\Backend\Model\Auth $subject): void
    {
        if ($this->backendUrl->useSecretKey()) {
            $this->cacheCleaner->execute();
        }
    }
}
