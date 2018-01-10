<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\Renderer;

use Gene\BlueFoot\Setup\DataConverter\RendererInterface;
use Gene\BlueFoot\Setup\DataConverter\EavAttributeLoaderInterface;
use Gene\BlueFoot\Setup\DataConverter\StyleExtractorInterface;

/**
 * Render image to PageBuilder format
 */
class Image implements RendererInterface
{
    /**
     * @var StyleExtractorInterface
     */
    private $styleExtractor;

    /**
     * @var EavAttributeLoaderInterface
     */
    private $eavAttributeLoader;

    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
    }

    /**
     * {@inheritdoc}
     */
    public function render(array $itemData, array $additionalData = [])
    {
        if (!isset($itemData['entityId'])) {
            throw new \InvalidArgumentException('entityId is missing.');
        }
        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);

        $rootElementAttributes = [
            'data-role' => 'image'
        ];

        if (isset($eavData['css_classes'])) {
            $rootElementAttributes['class'] = 'bluefoot-image bluefoot-entity ' . $eavData['css_classes'];
        } else {
            $rootElementAttributes['class'] = 'bluefoot-image bluefoot-entity';
        }

        if (isset($itemData['formData'])) {
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $rootElementAttributes['style'] = $style;
            }
        }

        $rootElementHtml = '<figure' . $this->printAttributes($rootElementAttributes);

        $linkAttributes = [
            'href' => '{{media url=gene-cms' . $eavData['image'] . '}}',
            'title' => $eavData['title_tag'] ?? '',
            'class' => (isset($eavData['has_lightbox']) && $eavData['has_lightbox'] == 1) ?
                'bluefoot-lightbox' : '',
        ];

        $imageAttributes = [
            'src' => '{{media url=gene-cms' . $eavData['image'] . '}}',
            'alt' => $eavData['alt_tag'] ?? '',
            'title' => $eavData['title_tag'] ?? ''
        ];

        $mobileImageHtml = '';
        if (isset($eavData['mobile_image'])) {
            $mobileImageAttributes = [
                'src' => '{{media url=gene-cms' . $eavData['mobile_image'] . '}}',
                'alt' => $eavData['alt_tag'] ?? '',
                'title' => $eavData['title_tag'] ?? ''
            ];
            $imageAttributes['class'] = 'bluefoot-mobile-hidden';

            $mobileImageHtml = '<img'
                . $this->printAttributes($mobileImageAttributes)
                . ' class="bluefoot-mobile-only">';
        }

        $imageHtml = '<img'
            . $this->printAttributes($imageAttributes)
            . '>';

        $captionHtml = '';
        if (isset($eavData['show_caption']) && $eavData['show_caption'] == 1) {
            $captionHtml .= '<figcaption>' . $eavData['title_tag'] . '</figcaption>';
        }

        $rootElementHtml .= '><a'
            . $this->printAttributes($linkAttributes)
            . '>'
            . $imageHtml
            . $mobileImageHtml
            . '</a>'
            . $captionHtml
            . '</figure>';

        return $rootElementHtml;
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
}
