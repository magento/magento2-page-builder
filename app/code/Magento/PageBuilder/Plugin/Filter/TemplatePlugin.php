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

    public function __construct(
        \Magento\Framework\View\ConfigInterface $viewConfig
    ) {
        $this->viewConfig = $viewConfig;
    }

    /**
     * @param \Magento\Framework\Filter\Template $subject
     * @param string $result
     *
     * @return string
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterFilter(\Magento\Framework\Filter\Template $subject, string $result)
    {
        // Validate if the filtered result requires background image processing
        if (strpos($result, self::DATA_BACKGROUND_IMAGE) !== false) {
            $domDocument = new \DOMDocument('1.0', 'UTF-8');
            set_error_handler(
                function ($errorNumber, $errorString) {
                    throw new \Exception($errorString, $errorNumber);
                }
            );
            $string = mb_convert_encoding($result, 'HTML-ENTITIES', 'UTF-8');
            $wrapperElementId = uniqid();
            try {
                libxml_use_internal_errors(true);
                $domDocument->loadHTML(
                    '<html><body id="' . $wrapperElementId . '">' . $string . '</body></html>'
                );
                libxml_clear_errors();
            } catch (\Exception $e) {
                restore_error_handler();
                $this->logger->critical($e);
            }
            restore_error_handler();
            $xpath = new \DOMXPath($domDocument);

            $this->generateBackgroundImageStyles($xpath);

            // Match the contents of the body from our generated document
            preg_match(
                '/<body id="' . $wrapperElementId . '">(.+)<\/body><\/html>$/si',
                mb_convert_encoding($domDocument->saveHTML(), 'UTF-8', 'HTML-ENTITIES'),
                $matches
            );

            return !empty($matches) ? $matches[1] : '';
        }
        return $result;
    }

    /**
     * Generate the CSS for any background images on the page
     *
     * @param \DOMXPath $xpath
     */
    private function generateBackgroundImageStyles(\DOMXPath $xpath)
    {
        $nodes = $xpath->query('//*[@' . self:: DATA_BACKGROUND_IMAGE . ']');
        foreach ($nodes as $node) {
            /* @var \DOMNode $node */
            $backgroundImages = $node->attributes->getNamedItem(self:: DATA_BACKGROUND_IMAGE);
            if ($backgroundImages->nodeValue !== '') {
                $elementClass = uniqid('background-image-');
                $images = json_decode(stripslashes($backgroundImages->nodeValue), true);
                $style = $xpath->document->createElement(
                    'style',
                    $this->generateCssFromImages($elementClass, $images)
                );
                $style->setAttribute("type", "text/css");
                $node->parentNode->appendChild($style);

                // Append our new class to the DOM element
                $classes = '';
                if ($node->attributes->getNamedItem('class')) {
                    $classes = $node->attributes->getNamedItem('class')->nodeValue . ' ';
                }
                $node->setAttribute('class', $classes . $elementClass);
                $node->removeAttribute(self:: DATA_BACKGROUND_IMAGE);
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
        if (isset($images['mobile_image']) && $this->getMobileBreakpoint()) {
            $mediaQuery = '@media only screen and (max-width: ' . $this->getMobileBreakpoint() . ')';
            $css[$mediaQuery]['.' . $elementClass] = [
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
        $output = "";
        foreach ($css as $selector => $body) {
            if (is_array($body)) {
                $output .= $selector . " {";
                $output .= $this->cssFromArray($body);
                $output .= "}";
            } else {
                $output .= $selector . ': ' . $body . ";";
            }
        }
        return $output;
    }

    /**
     * Retrieve the mobile breakpoint from the view configuration
     *
     * @return string
     */
    private function getMobileBreakpoint()
    {
        $breakpoints = $this->viewConfig->getViewConfig()->getVarValue('Magento_PageBuilder', 'breakpoints');
        if (isset($breakpoints['mobile'])) {
            return $breakpoints['mobile'];
        }
        return null;
    }
}
