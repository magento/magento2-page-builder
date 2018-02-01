<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter\Renderer;

use Magento\PageBuilder\Setup\DataConverter\RendererInterface;
use Magento\PageBuilder\Setup\DataConverter\EavAttributeLoaderInterface;
use Magento\PageBuilder\Setup\DataConverter\StyleExtractorInterface;

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
        if (!isset($itemData['entityId'])) {
            throw new \InvalidArgumentException('entityId is missing.');
        }
        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);

        $rootElementAttributes = [
            'data-role' => 'banner',
            'data-show-button' => 'always',
            'data-show-overlay' => 'never_show',
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
            'target' => isset($eavData['target_blank']) && $eavData['target_blank'] ? '_blank' : '',
        ];

        $imageAttributes = [
            'style' => 'background-image: url(' . '{{media url=gene-cms' . $eavData['image'] . '}}); ' .
                'min-height: 250px; background-size: default;',
            'class' => 'pagebuilder-banner-wrapper pagebuilder-banner-image'
        ];

        $mobileImageHtml = '';
        $mobileImageAttributes = [
            'style' => 'background-image: none; min-height: 250px; background-size: default;',
        ];
        if (isset($eavData['mobile_image'])) {
            $mobileImageAttributes = [
                'style' => 'background-image: url(' . '{{media url=gene-cms' . $eavData['mobile_image'] . '}}); ' .
                    'min-height: 250px; background-size: default;',
            ];
            $imageAttributes['class'] = 'pagebuilder-banner-wrapper pagebuilder-banner-image pagebuilder-mobile-hidden';
        }
        $mobileImageHtml = '<div'
            . $this->printAttributes($mobileImageAttributes)
            . ' class="pagebuilder-banner-wrapper pagebuilder-banner-mobile pagebuilder-mobile-only">';

        $imageHtml = '<div'
            . $this->printAttributes($imageAttributes)
            . '>';

        $descriptionHtml = '';
        if (isset($eavData['link_text'])) {
            $descriptionHtml = '<div>'
                . $eavData['link_text']
                . '</div>';
        }

        $overlayHtml = '<div class="pagebuilder-poster-overlay" data-background-color="transparent" ' .
            'style="min-height: 250px; background-color: transparent;">';

        if ($itemData['formData']['metric'] != '') {
            $marginsAndPaddings = $this->styleExtractor->extractStyle(['metric' => $itemData['formData']['metric']]);
            $paddings = explode("; ", $marginsAndPaddings)[1];
            $posterHtml = '<div class="pagebuilder-poster-content" style="' . $paddings . '">';
        } else {
            $posterHtml = '<div class="pagebuilder-poster-content" style="padding-top: 40px; padding-right: 40px; ' .
                'padding-bottom: 40px; padding-left: 40px;">';
        }

        $buttonHtml = '<button class="pagebuilder-banner-button action primary" ' .
            'style="visibility: visible; opacity: 1;"></button>';

        $rootElementHtml .= '><a'
            . $this->printAttributes($linkAttributes)
            . '>'
            . $mobileImageHtml
            . $overlayHtml
            . $posterHtml
            . '<div></div>'
            . $buttonHtml
            . '</div></div></div>'
            . $imageHtml
            . $overlayHtml
            . $posterHtml
            . '<div></div>'
            . $buttonHtml
            . '</div></div></div></a></div>';

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
