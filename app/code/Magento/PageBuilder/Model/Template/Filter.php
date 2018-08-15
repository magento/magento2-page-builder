<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Template;

class Filter
{
    /**
     * @var \Magento\PageBuilder\Model\Config
     */
    private $config;

    /**
     * @var \Magento\Framework\View\Element\BlockFactory
     */
    private $blockFactory;

    /**
     * @var \Psr\Log\LoggerInterface
     */
    private $logger;

    /**
     * @var \Magento\Framework\View\Layout
     */
    private $layout;

    /**
     * @var \Magento\Framework\App\Cache\Type\Layout
     */
    private $layoutCache;

    /**
     * @var \Magento\Cms\Model\Template\Filter
     */
    private $templateFilter;

    /**
     * Filter constructor.
     *
     * @param \Magento\PageBuilder\Model\Config $config
     * @param \Magento\Framework\View\Element\BlockFactory $blockFactory
     * @param \Psr\Log\LoggerInterface $logger
     * @param \Magento\Framework\View\Layout $layout
     * @param \Magento\Framework\App\Cache\Type\Layout $layoutCache
     * @param \Magento\Cms\Model\Template\Filter $templateFilter
     */
    public function __construct(
        \Magento\PageBuilder\Model\Config $config,
        \Magento\Framework\View\Element\BlockFactory $blockFactory,
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\View\Layout $layout,
        \Magento\Framework\App\Cache\Type\Layout $layoutCache,
        \Magento\Cms\Model\Template\Filter $templateFilter
    ) {
        $this->config = $config;
        $this->blockFactory = $blockFactory;
        $this->logger = $logger;
        $this->layout = $layout;
        $this->layoutCache = $layoutCache;
        $this->templateFilter = $templateFilter;
    }

    /**
     * Replace dynamic blocks with actual content
     *
     * @param string $html
     * @return string
     *
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    public function filter($html) : string
    {
        $domDocument = new \DOMDocument('1.0', 'UTF-8');
        set_error_handler(
            function ($errorNumber, $errorString) {
                throw new \Exception($errorString, $errorNumber);
            }
        );
        $string = mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');
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

        $contentTypes = $this->config->getContentTypes();

        $dynamicContentTypes = [];
        foreach ($contentTypes as $contentType => $contentTypeData) {
            if (isset($contentTypeData['backend_block'])) {
                $dynamicContentTypes[] = $contentType;
            }
        }

        if (count($dynamicContentTypes) > 0) {
            $conditions = [];
            foreach ($dynamicContentTypes as $contentType) {
                $conditions[] = '@data-role = "' . $contentType . '"';
            }

            $nodes = $xpath->query('//*[' . implode(' or ', $conditions) . ']');
            $replacements = [];
            foreach ($nodes as $node) {
                $data = [];
                foreach ($node->attributes as $attribute) {
                    $attributeName = str_replace(['data-', '-'], ['', '_'], $attribute->nodeName);
                    $data[$attributeName] = $attribute->nodeValue;
                }
                $backendBlockClassName = $contentTypes[$node->getAttribute('data-role')]['backend_block'];
                $backendBlockTemplate = isset($contentTypes[$node->getAttribute('data-role')]['backend_template'])
                    ? $contentTypes[$node->getAttribute('data-role')]['backend_template'] : false;
                if ($backendBlockTemplate) {
                    $data['template'] = $backendBlockTemplate;
                }
                $backendBlockInstance = $this->blockFactory->createBlock(
                    $backendBlockClassName,
                    ['data' => $data]
                );
                $this->layout->addBlock($backendBlockInstance);
                $uniqueIdentifier = 'block-' . uniqid();
                $replacements[$uniqueIdentifier] = $backendBlockInstance->toHtml();
                $node->parentNode->replaceChild($domDocument->createTextNode($uniqueIdentifier), $node);
            }
        }

        // Generate CSS for background images
        $this->generateBackgroundImageStyles($xpath);

        preg_match(
            '/<body id="' . $wrapperElementId . '">(.+)<\/body><\/html>$/si',
            mb_convert_encoding($domDocument->saveHTML(), 'UTF-8', 'HTML-ENTITIES'),
            $matches
        );

        return str_replace(
            array_keys($replacements),
            $replacements,
            !empty($matches) ? $matches[1] : ''
        );
    }

    /**
     * Generate the CSS for any background images on the page
     *
     * @param \DOMXPath $xpath
     */
    private function generateBackgroundImageStyles(\DOMXPath $xpath)
    {
        $nodes = $xpath->query('//*[@data-background-images]');
        foreach ($nodes as $node) {
            /* @var \DOMNode $node */
            $backgroundImages = $node->attributes->getNamedItem('data-background-images');
            if ($backgroundImages->nodeValue !== '') {
                $elementClass = uniqid('background-image-');
                $images = json_decode(stripslashes($backgroundImages->nodeValue), true);
                $style = $xpath->document->createElement(
                    'style',
                    $this->generateCssFromImages($elementClass, $images)
                );
                $node->parentNode->appendChild($style);

                // Append our new class to the DOM element
                $classes = '';
                if ($node->attributes->getNamedItem('class')) {
                    $classes = $node->attributes->getNamedItem('class')->nodeValue . ' ';
                }
                $node->setAttribute('class', $classes . $elementClass);
                $node->removeAttribute('data-background-images');
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
        if (isset($images['mobile_image'])) {
            // TODO: pull this from the LESS during static generation, or at another time
            $maxWidth = 767;
            $mediaQuery = '@media only screen and (max-width: ' . $maxWidth . 'px)';
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
                $output .= $selector . " {\n";
                $output .= $this->cssFromArray($body);
                $output .= "}\n";
            } else {
                $output .= $selector . ': ' . $body . ";\n";
            }
        }
        return $output;
    }
}
