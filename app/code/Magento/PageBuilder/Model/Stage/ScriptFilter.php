<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage;

use Psr\Log\LoggerInterface;

/**
 * Filters script tags from stage output
 *
 * @api
 */
class ScriptFilter
{
    /**
     * @var LoggerInterface
     */
    private $loggerInterface;

    /**
     * ScriptFilter constructor.
     * @param LoggerInterface $loggerInterface
     */
    public function __construct(
        LoggerInterface $loggerInterface
    ) {
        $this->loggerInterface = $loggerInterface;
    }

    /**
     * Remove script tag from html
     *
     * @param string $content
     * @return string
     */
    public function removeScriptTags(string $content): string
    {
        $dom = new \DOMDocument();
        try {
            //this code is required because of https://bugs.php.net/bug.php?id=60021
            $previous = libxml_use_internal_errors(true);
            $dom->loadHTML($content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        } catch (\Exception $e) {
            $this->loggerInterface->critical($e->getMessage());
        }
        libxml_use_internal_errors($previous);
        foreach (iterator_to_array($dom->getElementsByTagName('script')) as $item) {
            $item->parentNode->removeChild($item);
        }
        return $dom->saveHTML();
    }
}