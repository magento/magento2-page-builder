<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage;

use Psr\Log\LoggerInterface;

/**
 * Filters HTML from stage output
 *
 * @api
 */
class HtmlFilter
{
    /**
     * @var LoggerInterface
     */
    private $loggerInterface;

    /**
     * HtmlFilter constructor.
     * @param LoggerInterface $loggerInterface
     */
    public function __construct(
        LoggerInterface $loggerInterface
    ) {
        $this->loggerInterface = $loggerInterface;
    }

    /**
     * Filter HTML text to remove script tags and encode HTML content types
     *
     * @param string $content
     * @return string
     */
    public function filterHtml(string $content): string
    {
        $dom = new \DOMDocument('1.0', 'UTF-8');
        $previous = '';
        try {
            //this code is required because of https://bugs.php.net/bug.php?id=60021
            $previous = libxml_use_internal_errors(true);
            $content = '<div>' . $content . '</div>';
            $convmap = [0x80, 0x10FFFF, 0, 0x1FFFFF];
            $string = mb_encode_numericentity(
                $content,
                $convmap,
                'UTF-8'
            );
            $dom->loadHTML($string, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        } catch (\Exception $e) {
            $this->loggerInterface->critical($e->getMessage());
        }
        libxml_use_internal_errors($previous);
        // Remove all <script /> tags, on* attributes from output
        /** @var \DOMElement $item */
        foreach (iterator_to_array($dom->getElementsByTagName('*')) as $item) {
            if (in_array($item->tagName, ['script', 'meta', 'embed', 'object'])) {
                $item->parentNode->removeChild($item);
            } else {
                foreach (iterator_to_array($item->attributes) as $attribute) {
                    if (stripos($attribute->name, 'on') === 0 ||
                        stripos(ltrim($attribute->value), 'javascript') === 0
                    ) {
                        $item->removeAttribute($attribute->name);
                    }
                }
            }
        }
        $xpath = new \DOMXPath($dom);
        $htmlContentTypes = $xpath->query(
            '//*[@data-content-type="html" and not(contains(@class, "placeholder-html-code"))]'
        );
        foreach ($htmlContentTypes as $htmlContentType) {
            /* @var \DOMElement $htmlContentType */
            $innerHTML = '';
            $children = $htmlContentType->childNodes;
            foreach ($children as $child) {
                $innerHTML .= $child->ownerDocument->saveXML($child);
            }
            $htmlContentType->setAttribute(
                "class",
                $htmlContentType->getAttribute("class") . " placeholder-html-code"
            );
            $htmlContentType->nodeValue = htmlentities($innerHTML);
        }
        return substr(trim($dom->saveHTML()), 5, -6);
    }
}
