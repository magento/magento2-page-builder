<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\Filter;

/**
 * Plugin to the template filter to process any background images added by Page Builder
 */
class TemplatePlugin
{
    const DATA_BACKGROUND_IMAGE = 'data-background-images';

    /**
     * @var \Magento\Framework\View\ConfigInterface
     */
    private $viewConfig;

    /**
     * @var \Psr\Log\LoggerInterface
     */
    private $logger;

    /**
     * @var \DOMDocument
     */
    private $domDocument;

    /**
     * @param \Psr\Log\LoggerInterface $logger
     * @param \Magento\Framework\View\ConfigInterface $viewConfig
     */
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\View\ConfigInterface $viewConfig
    ) {
        $this->logger = $logger;
        $this->viewConfig = $viewConfig;
    }

    /**
     * After filter of template data apply transformations
     *
     * @param \Magento\Framework\Filter\Template $subject
     * @param string $result
     *
     * @return string
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterFilter(\Magento\Framework\Filter\Template $subject, string $result) : string
    {
        // Validate if the filtered result requires background image processing
        if (strpos($result, self::DATA_BACKGROUND_IMAGE) !== false) {
            $document = $this->getDomDocument($result);
            $this->generateBackgroundImageStyles($document);
        }

        // Process any HTML content types, they need to be decoded on the front-end
        if (strpos($result, 'data-role="html"') !== false) {
            $document = $this->getDomDocument($result);
            $this->decodeHtmlContentTypes($document);
        }

        if (isset($document)) {
            // Match the contents of the body from our generated document
            preg_match(
                '/<body>(.+)<\/body><\/html>$/si',
                $document->saveHTML(),
                $matches
            );

            $result = !empty($matches) ? $matches[1] : $result;
        }

        return $result;
    }

    /**
     * Create a DOM document from a given string
     *
     * @param string $html
     *
     * @return \DOMDocument
     */
    private function getDomDocument(string $html) : \DOMDocument
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
     * @return \DOMDocument
     */
    private function createDomDocument(string $html) : \DOMDocument
    {
        $domDocument = new \DOMDocument('1.0', 'UTF-8');
        set_error_handler(
            function ($errorNumber, $errorString) {
                throw new \Exception($errorString, $errorNumber);
            }
        );
        $string = mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');
        try {
            libxml_use_internal_errors(true);
            $domDocument->loadHTML(
                '<html><body>' . $string . '</body></html>'
            );
            libxml_clear_errors();
        } catch (\Exception $e) {
            restore_error_handler();
            $this->logger->critical($e);
        }
        restore_error_handler();

        return $domDocument;
    }

    /**
     * Decode the contents of any HTML content types for the store front
     *
     * @param \DOMDocument $document
     */
    private function decodeHtmlContentTypes(\DOMDocument $document): void
    {
        $xpath = new \DOMXPath($document);
        $nodes = $xpath->query('//*[@data-role="html" and not(@data-decoded="true")]');
        foreach ($nodes as $node) {
            if (strlen(trim($node->nodeValue)) > 0) {
                /* @var \DOMElement $node */
                $fragment = $document->createDocumentFragment();
                $fragment->appendXML($node->nodeValue);
                // Store a decoded attribute on the element so we don't double decode
                $node->setAttribute("data-decoded", "true");
                $node->nodeValue = "";

                // If the HTML code in the content type is invalid it may throw
                try {
                    $node->appendChild($fragment);
                } catch (\Exception $e) {
                    $this->logger->critical($e);
                }
            }
        }
    }

    /**
     * Generate the CSS for any background images on the page
     *
     * @param \DOMDocument $document
     */
    private function generateBackgroundImageStyles(\DOMDocument $document) : void
    {
        $xpath = new \DOMXPath($document);
        $nodes = $xpath->query('//*[@' . self:: DATA_BACKGROUND_IMAGE . ']');
        foreach ($nodes as $node) {
            /* @var \DOMElement $node */
            $backgroundImages = $node->attributes->getNamedItem(self:: DATA_BACKGROUND_IMAGE);
            if ($backgroundImages->nodeValue !== '') {
                $elementClass = uniqid('background-image-');
                $images = json_decode(stripslashes($backgroundImages->nodeValue), true);
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
        if (isset($images['mobile_image']) && $this->getMobileMediaQuery()) {
            $css[$this->getMobileMediaQuery()]['.' . $elementClass] = [
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
     * @return null|string
     */
    private function getMobileMediaQuery() : ?string
    {
        $breakpoints = $this->viewConfig->getViewConfig()->getVarValue(
            'Magento_PageBuilder',
            'breakpoints/mobile/conditions'
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
}
