<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types = 1);

namespace Magento\PageBuilder\Setup\Converters;

use DOMDocument;
use DOMElement;
use DOMException;
use DOMNode;
use DOMXPath;
use Exception;
use Magento\Framework\DB\DataConverter\DataConverterInterface;

/**
 * ...
 */
class PageBuilderStripStyles implements DataConverterInterface
{
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
     * @param int $length
     * @param string $prefix
     * @return string
     */
    private function generateDataAttribute(int $length = 7, string $prefix = 'style-'): string
    {
        return $prefix . substr(strtoupper(uniqid()), 0, $length); // @todo: Fix RNGesus...
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
            $output .= '[data-pb-style="' . $selector . '"] { ';
            $output .= $styles;
            $output .= ' }';
        }

        return $output;
    }

    /**
     * @inheritDoc
     */
    public function convert($value)
    {
        $document = new DOMDocument();
        $document->loadHTML($value);
        $xpath = new DOMXPath($document);

        // Query for Inline Styles
        $nodes = $xpath->query('//*[@style]');

        $styleMap = array();

        foreach ($nodes as $node) {
            /* @var DOMElement $node */
            $styleAttr = $node->getAttribute('style');

            if ($styleAttr) {
                $generatedDataAttribute = $this->generateDataAttribute();
                $node->setAttribute('data-pb-style', $this->generateDataAttribute());

                // Add for Internal Style Generation
                $styleMap[$generatedDataAttribute] = $styleAttr;

                // Strip Inline Styles
                $node->removeAttribute('style');
            }
        }

        // Style Block Generation
        $style = $document->createElement(
            'style',
            $this->generateInternalStyles($styleMap)
        );
        $style->setAttribute('type', 'text/css');
        $xpath->query('//body')[0]->appendChild($style); // @todo: Refactor

        // @todo: Refactor
        preg_match(
            '/<html><body>(.+)<\/body><\/html>$/si',
            $document->saveHTML(),
            $matches
        );

        return $matches && $nodes->count() > 0 ? $matches[1] : $value;
    }
}
