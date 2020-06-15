<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Filter;

use DOMDocument;
use DOMElement;
use DOMException;
use DOMNode;
use DOMXPath;
use Exception;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Math\Random;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\View\ConfigInterface;
use Magento\PageBuilder\Plugin\Filter\TemplatePlugin;
use Psr\Log\LoggerInterface;

/**
 * Specific template filters for Page Builder content
 */
class Template
{
    /**
     * @var ConfigInterface
     */
    private $viewConfig;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var DOMDocument
     */
    private $domDocument;

    /**
     * @var Random
     */
    private $mathRandom;

    /**
     * @var Json
     */
    private $json;

    /**
     * @var array
     */
    private $scripts;

    /**
     * @param LoggerInterface $logger
     * @param ConfigInterface $viewConfig
     * @param Random $mathRandom
     * @param Json $json
     */
    public function __construct(
        LoggerInterface $logger,
        ConfigInterface $viewConfig,
        Random $mathRandom,
        Json $json
    ) {
        $this->logger = $logger;
        $this->viewConfig = $viewConfig;
        $this->mathRandom = $mathRandom;
        $this->json = $json;
    }

    /**
     * After filter of template data apply transformations
     *
     * @param string $result
     * @return string
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function filter(string $result) : string
    {
        $this->domDocument = false;
        $this->scripts = [];

        // Validate if the filtered result requires background image processing
        if (preg_match(TemplatePlugin::BACKGROUND_IMAGE_PATTERN, $result)) {
            $document = $this->getDomDocument($result);
            $this->generateBackgroundImageStyles($document);
        }

        // Process any HTML content types, they need to be decoded on the front-end
        if (preg_match(TemplatePlugin::HTML_CONTENT_TYPE_PATTERN, $result)) {
            $document = $this->getDomDocument($result);
            $uniqueNodeNameToDecodedOuterHtmlMap = $this->generateDecodedHtmlPlaceholderMappingInDocument($document);
        }

        // If a document was retrieved we've modified the output so need to retrieve it from within the document
        if (isset($document)) {
            // Match the contents of the body from our generated document
            preg_match(
                '/<body>(.+)<\/body><\/html>$/si',
                $document->saveHTML(),
                $matches
            );

            if (!empty($matches)) {
                $docHtml = $matches[1];

                // restore any encoded directives
                $docHtml = preg_replace_callback(
                    '/=\"(%7B%7B[^"]*%7D%7D)\"/m',
                    function ($matches) {
                        return urldecode($matches[0]);
                    },
                    $docHtml
                );

                if (isset($uniqueNodeNameToDecodedOuterHtmlMap)) {
                    foreach ($uniqueNodeNameToDecodedOuterHtmlMap as $uniqueNodeName => $decodedOuterHtml) {
                        $docHtml = str_replace(
                            '<' . $uniqueNodeName . '>' . '</' . $uniqueNodeName . '>',
                            $decodedOuterHtml,
                            $docHtml
                        );
                    }
                }

                $result = $docHtml;
            }

            $result = $this->unmaskScriptTags($result);
        }

        return $result;
    }

    /**
     * Create a DOM document from a given string
     *
     * @param string $html
     *
     * @return DOMDocument
     */
    private function getDomDocument(string $html) : DOMDocument
    {
        if (!$this->domDocument) {
            $this->domDocument = $this->createDomDocument($html);
        }

        return $this->domDocument;
    }

    /**
     * Create a DOMDocument from a string
     *
     * @param string $html
     *
     * @return DOMDocument
     */
    private function createDomDocument(string $html) : DOMDocument
    {
        $html = $this->maskScriptTags($html);

        $domDocument = new DOMDocument('1.0', 'UTF-8');
        set_error_handler(
            function ($errorNumber, $errorString) {
                throw new DOMException($errorString, $errorNumber);
            }
        );
        $string = mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');
        try {
            libxml_use_internal_errors(true);
            $domDocument->loadHTML(
                '<html><body>' . $string . '</body></html>'
            );
            libxml_clear_errors();
        } catch (Exception $e) {
            restore_error_handler();
            $this->logger->critical($e);
        }
        restore_error_handler();

        return $domDocument;
    }

    /**
     * Convert encoded HTML content types to placeholders and generate decoded outer html map for future replacement
     *
     * @param DOMDocument $document
     * @return array
     * @throws LocalizedException
     */
    private function generateDecodedHtmlPlaceholderMappingInDocument(DOMDocument $document): array
    {
        $xpath = new DOMXPath($document);

        // construct xpath query to fetch top-level ancestor html content type nodes
        /** @var $htmlContentTypeNodes DOMNode[] */
        $htmlContentTypeNodes = $xpath->query(
            '//*[@data-content-type="html" and not(@data-decoded="true")]' .
            '[not(ancestor::*[@data-content-type="html"])]'
        );

        $uniqueNodeNameToDecodedOuterHtmlMap = [];

        foreach ($htmlContentTypeNodes as $htmlContentTypeNode) {
            // Set decoded attribute on all encoded html content types so we don't double decode;
            $htmlContentTypeNode->setAttribute('data-decoded', 'true');

            // if nothing exists inside the node, continue
            if (!strlen(trim($htmlContentTypeNode->nodeValue))) {
                continue;
            }

            // clone html code content type to save reference to its attributes/outerHTML, which we are not going to
            // decode
            $clonedHtmlContentTypeNode = clone $htmlContentTypeNode;

            // clear inner contents of cloned node for replacement later with $decodedInnerHtml using sprintf;
            // we want to retain html content type node and avoid doing any manipulation on it
            $clonedHtmlContentTypeNode->nodeValue = '%s';

            // remove potentially harmful attributes on html content type node itself
            while ($htmlContentTypeNode->attributes->length) {
                $htmlContentTypeNode->removeAttribute($htmlContentTypeNode->attributes->item(0)->name);
            }

            // decode outerHTML safely
            $preDecodedOuterHtml = $document->saveHTML($htmlContentTypeNode);

            // clear empty <div> wrapper around outerHTML to replace with $clonedHtmlContentTypeNode
            // phpcs:ignore Magento2.Functions.DiscouragedFunction
            $decodedInnerHtml = preg_replace('#^<[^>]*>|</[^>]*>$#', '', html_entity_decode($preDecodedOuterHtml));

            // Use $clonedHtmlContentTypeNode's placeholder to inject decoded inner html
            $decodedOuterHtml = sprintf($document->saveHTML($clonedHtmlContentTypeNode), $decodedInnerHtml);

            // generate unique node name element to replace with decoded html contents at end of processing;
            // goal is to create a document as few times as possible to prevent inadvertent parsing of contents as html
            // by the dom library
            $uniqueNodeName = $this->mathRandom->getRandomString(32, $this->mathRandom::CHARS_LOWERS);

            $uniqueNode = new DOMElement($uniqueNodeName);
            $htmlContentTypeNode->parentNode->replaceChild($uniqueNode, $htmlContentTypeNode);

            $uniqueNodeNameToDecodedOuterHtmlMap[$uniqueNodeName] = $decodedOuterHtml;
        }

        return $uniqueNodeNameToDecodedOuterHtmlMap;
    }

    /**
     * Generate the CSS for any background images on the page
     *
     * @param DOMDocument $document
     */
    private function generateBackgroundImageStyles(DOMDocument $document) : void
    {
        $xpath = new DOMXPath($document);
        $nodes = $xpath->query('//*[@data-background-images]');
        foreach ($nodes as $node) {
            /* @var DOMElement $node */
            $backgroundImages = $node->attributes->getNamedItem('data-background-images');
            if ($backgroundImages->nodeValue !== '') {
                $elementClass = uniqid('background-image-');
                // phpcs:ignore Magento2.Functions.DiscouragedFunction
                $images = $this->json->unserialize(stripslashes($backgroundImages->nodeValue));
                if (count($images) > 0) {
                    $style = $xpath->document->createElement(
                        'style',
                        $this->generateCssFromImages($elementClass, $images)
                    );
                    $style->setAttribute('type', 'text/css');
                    $node->parentNode->appendChild($style);

                    // Append our new class to the DOM element
                    $classes = '';
                    if ($node->attributes->getNamedItem('class')) {
                        $classes = $node->attributes->getNamedItem('class')->nodeValue . ' ';
                    }
                    $node->setAttribute('class', $classes . $elementClass);
                }
            }
        }
    }

    /**
     * Generate CSS based on the images array from our attribute
     *
     * @param string $elementClass
     * @param array $images
     *
     * @return string
     */
    private function generateCssFromImages(string $elementClass, array $images) : string
    {
        $css = [];
        if (isset($images['desktop_image'])) {
            $css['.' . $elementClass] = [
                'background-image' => 'url(' . $images['desktop_image'] . ')',
            ];
        }
        if (isset($images['mobile_image']) && $this->getMediaQuery('mobile')) {
            $css[$this->getMediaQuery('mobile')]['.' . $elementClass] = [
                'background-image' => 'url(' . $images['mobile_image'] . ')',
            ];
        }
        if (isset($images['mobile_image']) && $this->getMediaQuery('mobile-small')) {
            $css[$this->getMediaQuery('mobile-small')]['.' . $elementClass] = [
                'background-image' => 'url(' . $images['mobile_image'] . ')',
            ];
        }
        return $this->cssFromArray($css);
    }

    /**
     * Generate a CSS string from an array
     *
     * @param array $css
     *
     * @return string
     */
    private function cssFromArray(array $css) : string
    {
        $output = '';
        foreach ($css as $selector => $body) {
            if (is_array($body)) {
                $output .= $selector . ' {';
                $output .= $this->cssFromArray($body);
                $output .= '}';
            } else {
                $output .= $selector . ': ' . $body . ';';
            }
        }
        return $output;
    }

    /**
     * Generate the mobile media query from view configuration
     *
     * @param string $view
     * @return null|string
     */
    private function getMediaQuery(string $view) : ?string
    {
        $breakpoints = $this->viewConfig->getViewConfig()->getVarValue(
            'Magento_PageBuilder',
            'breakpoints/' . $view . '/conditions'
        );
        if ($breakpoints && count($breakpoints) > 0) {
            $mobileBreakpoint = '@media only screen ';
            foreach ($breakpoints as $key => $value) {
                $mobileBreakpoint .= 'and (' . $key . ': ' . $value . ') ';
            }
            return rtrim($mobileBreakpoint);
        }
        return null;
    }

    /**
     * Masks "x-magento-template" script tags in html content before loading it into DOM parser
     *
     * DOMDocument::loadHTML() will remove any closing tag inside script tag and will result in broken html template
     *
     * @param string $content
     * @return string
     * @see https://bugs.php.net/bug.php?id=52012
     */
    private function maskScriptTags(string $content): string
    {
        $tag = 'script';
        $content = preg_replace_callback(
            sprintf('#<%1$s[^>]*type="text/x-magento-template\"[^>]*>.*?</%1$s>#is', $tag),
            function ($matches) {
                $key = $this->mathRandom->getRandomString(32, $this->mathRandom::CHARS_LOWERS);
                $this->scripts[$key] = $matches[0];
                return '<' . $key . '>' . '</' . $key . '>';
            },
            $content
        );
        return $content;
    }

    /**
     * Replaces masked "x-magento-template" script tags with their corresponding content
     *
     * @param string $content
     * @return string
     * @see maskScriptTags()
     */
    private function unmaskScriptTags(string $content): string
    {
        foreach ($this->scripts as $key => $script) {
            $content = str_replace(
                '<' . $key . '>' . '</' . $key . '>',
                $script,
                $content
            );
        }
        return $content;
    }
}
