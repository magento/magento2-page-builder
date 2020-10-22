<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types = 1);

namespace Magento\PageBuilder\Setup\Converters;

use Magento\Framework\DB\DataConverter\DataConverterInterface;
use Magento\PageBuilder\Model\Dom\Adapter\ElementInterface;
use Magento\PageBuilder\Model\Dom\HtmlDocumentFactory;

/**
 * Convert Inline Styles to Internal
 */
class PageBuilderStripStyles implements DataConverterInterface
{
    private const BODY_ID = 'html-body';
    private const DATA_ATTRIBUTE = 'data-pb-style';
    private const QUERY_SELECTOR = '[style]';

    /**
     * @var HtmlDocumentFactory
     */
    private $htmlDocumentFactory;

    /**
     * @param HtmlDocumentFactory $htmlDocumentFactory
     */
    public function __construct(HtmlDocumentFactory $htmlDocumentFactory)
    {
        $this->htmlDocumentFactory = $htmlDocumentFactory;
    }

    /**
     * Generates `mageUtils.uniqueid()` Naming Convention
     *
     * @return string
     */
    private function generateDataAttribute(): string
    {
        return \strtoupper(\uniqid());
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
        $document = $this->htmlDocumentFactory->create([ 'document' => $value ]);
        $body = $document->querySelector('body');
        $nodes = $document->querySelectorAll(self::QUERY_SELECTOR);

        if ($nodes->count() > 0) {
            $styleMap = [];

            foreach ($nodes as $node) {
                /* @var ElementInterface $node */
                $styleAttr = $node->getAttribute('style');

                if ($styleAttr) {
                    $generatedDataAttribute = $this->generateDataAttribute();
                    $node->setAttribute(self::DATA_ATTRIBUTE, $generatedDataAttribute);
                    $styleMap[$generatedDataAttribute] = $styleAttr; // Amend Array for Internal Style Generation
                    $node->removeAttribute('style');
                }
            }

            if (count($styleMap) > 0) {
                // Style Block Generation
                $style = $document->createElement(
                    'style',
                    $this->generateInternalStyles($styleMap)
                );
                $body->appendChild($style);

                return $document->stripHtmlWrapperTags();
            } else {
                return $value;
            }
        }

        return $value;
    }
}
