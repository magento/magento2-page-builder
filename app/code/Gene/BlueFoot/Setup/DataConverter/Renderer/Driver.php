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
        $eavData = $this->eavAttributeLoader->load($itemData);

        $rootElementAttributes = [
            'data-role' => 'driver',
            'class' => $eavData['css_classes'] ?? ''
        ];

        if (isset($itemData['formData'])) {
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $rootElementAttributes['style'] = $style;
            }
        }

        $rootElementHtml = '<div'
            . $this->printAttributes($rootElementAttributes);

        $linkAttributes = [
            'href' => $eavData['link_url'] ?? '',
            'title' => $eavData['title_tag'] ?? '',
            'target' => isset($eavData['target_blank']) && $eavData['target_blank'] ? '_blank' : '',
        ];

        $imageAttributes = [
            'src' => '{{media url=' . $eavData['image'] . '}}',
            'alt' => $eavData['alt_tag'] ?? '',
            'title' => $eavData['title_tag'] ?? ''
        ];

        $imageHtml = '<img'
            . $this->printAttributes($imageAttributes)
            . ' />';

        $mobileImageHtml = '';
        if (isset($eavData['mobile_image'])) {
            $mobileImageAttributes = [
                'src' => '{{media url=' . $eavData['mobile_image'] . '}}',
                'alt' => $eavData['alt_tag'] ?? '',
                'title' => $eavData['title_tag'] ?? ''
            ];
            $imageAttributes['class'] = 'bluefoot-mobile-hidden';

            $mobileImageHtml = '<img'
                . $this->printAttributes($mobileImageAttributes)
                . ' class="bluefoot-mobile-only" />';
        }

        $descriptionHtml = '';
        if (isset($eavData['link_text'])) {
            $descriptionHtml = '<div>'
                . $eavData['link_text']
                . '</div>';
        }

        $rootElementHtml .= '><a'
            . $this->printAttributes($linkAttributes)
            . '>'
            . $imageHtml
            . $mobileImageHtml
            . $descriptionHtml
            . '</a></div>';

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
