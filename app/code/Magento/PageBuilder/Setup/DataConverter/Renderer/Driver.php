<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Setup\DataConverter\Renderer;

use Magento\PageBuilder\Setup\DataConverter\RendererInterface;
use Magento\PageBuilder\Setup\DataConverter\EavAttributeLoaderInterface;
use Magento\PageBuilder\Setup\DataConverter\StyleExtractorInterface;
use Magento\Framework\Serialize\Serializer\Json;

/**
 * Render driver to PageBuilder format
 */
class Driver implements RendererInterface
{
    /**
     * @var StyleExtractorInterface
     */
    private $styleExtractor;

    /**
     * @var EavAttributeLoaderInterface
     */
    private $eavAttributeLoader;

    /**
     * @var Json
     */
    private $serializer;

    /**
     * Driver constructor.
     * @param StyleExtractorInterface $styleExtractor
     * @param EavAttributeLoaderInterface $eavAttributeLoader
     * @param Json $serializer
     */
    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader,
        Json $serializer
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
        $this->serializer = $serializer;
    }

    /**
     * @inheritdoc
     */
    public function render(array $itemData, array $additionalData = []) : string
    {
        if (!isset($itemData['entityId'])) {
            throw new \InvalidArgumentException('entityId is missing.');
        }
        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);
        $rootElementAttributes = [
            'data-element' => 'main',
            'data-role' => 'banner',
            'data-appearance' => 'poster',
            'data-show-button' => 'never',
            'data-show-overlay' => 'never',
            'class' => $eavData['css_classes'] ?? ''
        ];
        $margin = ' margin: 0px;';
        $padding = ' padding: 40px;';
        $textAlign = '';
        $rootElementAttributes['style'] = 'background-size: auto; background-repeat: no-repeat; '
            . 'background-attachment: scroll; border: 1px none; border-radius: 0px;';
        if (isset($itemData['formData'])) {
            $formData = $itemData['formData'];
            list($formData, $margin, $padding, $textAlign) = $this->extractStyle(
                $formData,
                $margin,
                $padding,
                $textAlign
            );
            $style = $this->styleExtractor->extractStyle($formData);
            if ($style) {
                $rootElementAttributes['style'] .= ' ' . $style;
            }
        }
        $rootElementAttributes['style'] .= $margin;
        $linkAttributes = [
            'data-element' => 'link',
            'href' => $eavData['link_url'] ?? '',
            'target' => isset($eavData['target_blank']) && $eavData['target_blank'] ? '_blank' : '',
        ];

        $imageAttributes = [
            'data-element' => 'wrapper',
            'data-background-images' => '{\&quot;'
                . 'desktop_image\&quot;:\&quot;'
                . '{{media url=wysiwyg'
                . $eavData['image']
                . '}}\&quot;,\&quot;'
                . 'mobile_image\&quot;:\&quot;'
                . '{{media url=wysiwyg'
                . $eavData['image']
                . '}}\&quot;}',
            'style' => 'min-height: 300px; background-size: auto; '
                . 'background-repeat: no-repeat; background-attachment: scroll;'
                . $textAlign,
            'class' => 'pagebuilder-banner-wrapper'
        ];

        $imageElementHtml = '<div' . $this->printAttributes($imageAttributes) . '>';
        $overlayElementHtml = '<div '
            . 'data-element="overlay" class="pagebuilder-poster-overlay" data-overlay-color="transparent" '
            . 'style="background-color: transparent; min-height: 300px;' . $padding . '">';
        $buttonHtml = '';
        if (isset($eavData['link_text']) && $eavData['link_text'] !== '') {
            $rootElementAttributes['data-show-button'] = 'always';
            $buttonHtml = '<button data-element="button" class="pagebuilder-banner-button pagebuilder-button-primary" '
                . 'style="visibility: visible; opacity: 1;">'
                . $eavData['link_text']
                . '</button>';
        }

        return '<div'
            . $this->printAttributes($rootElementAttributes)
            . '><div'
            . $this->printAttributes($linkAttributes)
            . '>'
            . $imageElementHtml
            . $overlayElementHtml
            . '<div class="pagebuilder-poster-content"><div data-element="content"></div>'
            . $buttonHtml
            . '</div></div></div>'
            . $overlayElementHtml
            . '<div class="pagebuilder-poster-content"><div data-element="content"></div>'
            . $buttonHtml
            . '</div></div></div></div></div>';
    }

    /**
     * Print HTML attributes
     *
     * @param array $elementAttributes
     * @return string
     */
    private function printAttributes($elementAttributes): string
    {
        $elementAttributesHtml = '';
        foreach ($elementAttributes as $attributeName => $attributeValue) {
            $elementAttributesHtml .= $attributeValue !== '' ? " $attributeName=\"$attributeValue\"" : '';
        }
        return $elementAttributesHtml;
    }

    /**
     * Extract margin, padding and align properties
     *
     * @param array $formData
     * @param string $margin
     * @param string $padding
     * @param string $textAlign
     * @return array
     */
    private function extractStyle(array $formData, $margin, $padding, $textAlign): array
    {
        if (isset($formData['metric']) && $formData['metric'] !== '') {
            $metric = $this->serializer->unserialize($formData['metric']);
            if (isset($metric['margin'])) {
                $margin = ' margin: ' . str_replace('-', '0px', $metric['margin']) . ';';
                unset($metric['margin']);
            }
            if (isset($metric['padding'])) {
                $padding = ' padding: ' . str_replace('-', '0px', $metric['padding']) . ';';
                unset($metric['padding']);
            }
            $formData['metric'] = $this->serializer->serialize($metric);
        }
        if (isset($formData['align']) && $formData['align'] !== '') {
            $textAlign = ' text-align: ' . $formData['align'] . ';';
            unset($formData['align']);
        }
        return [$formData, $margin, $padding, $textAlign];
    }
}
