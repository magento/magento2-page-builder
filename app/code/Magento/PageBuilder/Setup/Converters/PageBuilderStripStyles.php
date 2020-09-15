<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types = 1);

namespace Magento\PageBuilder\Setup\Converters;

use DOMDocument;
use DOMElement;
use DOMXPath;
use Magento\Framework\DB\DataConverter\DataConverterInterface;

/**
 * Convert Inline Styles to Internal
 */
class PageBuilderStripStyles implements DataConverterInterface
{
    const BODY_ID = 'html-body';
    const DATA_ATTRIBUTE = 'data-pb-style';
    const XPATH_SELECTOR = '//*[@data-content-type][@style]|//*[@data-content-type]/*[@style]';

    /**
     * @var DOMDocument
     */
    private $domDocument;

    /**
     * @param DOMDocument $domDocument
     */
    public function __construct(DOMDocument $domDocument)
    {
        $this->domDocument = $domDocument;
    }

    /**
     * Generates `mageUtils.uniqueid()` Naming Convention
     *
     * @return string
     */
    private function generateDataAttribute(): string
    {
        return strtoupper(uniqid());
    }

    /**
     * Converts Inline Styles to Internal Styles
     *
     * @param array $styleMap
     * @return string
     */
    private function generateInternalStyles(array $styleMap): string
    {
        $output = '';

        foreach ($styleMap as $selector => $styles) {
            $output .= '#' . self::BODY_ID . ' [' . self::DATA_ATTRIBUTE . '="' . $selector . '"]';
            $output .= '{' . $styles . '}';
        }

        return $output;
    }

    /**
     * @inheritDoc
     */
    public function convert($value): string
    {
        libxml_use_internal_errors(true);
        $document = new DOMDocument();
        $document->loadHTML($value);
        $xpath = new DOMXPath($document);
        libxml_clear_errors();

        $body = $document->documentElement->lastChild;
        $nodes = $xpath->query(self::XPATH_SELECTOR); // Query for Inline Styles
        $styleMap = [];

        foreach ($nodes as $node) {
            /* @var DOMElement $node */
            $styleAttr = $node->getAttribute('style');

            if ($styleAttr) {
                $generatedDataAttribute = $this->generateDataAttribute();
                $node->setAttribute(self::DATA_ATTRIBUTE, $generatedDataAttribute);
                $styleMap[$generatedDataAttribute] = $styleAttr; // Amend Array for Internal Style Generation
                $node->removeAttribute('style');
            }
        }

        // Style Block Generation
        $style = $document->createElement(
            'style',
            $this->generateInternalStyles($styleMap)
        );
        $body->appendChild($style);

        // @todo: Refactor
        preg_match(
            '/<html><body>(.+)<\/body><\/html>$/si',
            $document->saveHTML(),
            $matches
        );

        return $matches && $nodes->count() > 0 ? $matches[1] : $value;
    }
}
