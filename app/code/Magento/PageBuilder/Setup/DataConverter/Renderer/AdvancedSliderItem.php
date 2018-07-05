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

/**
 * Render advanced slider item to PageBuilder format
 */
class AdvancedSliderItem implements RendererInterface
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
     *
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    public function render(array $itemData, array $additionalData = []) : string
    {
        if (!isset($itemData['entityId'])) {
            throw new \InvalidArgumentException('entityId is missing.');
        }
        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);

        $rootElementAttributes = [
            'data-element' => 'main',
            'data-role' => 'slide',
            'data-appearance' => 'poster',
            'class' => $eavData['css_classes'] ?? ''
        ];

        $formData = $itemData['formData'] ?? [];
        $formData['background_image'] = '';
        if (isset($eavData['background_image'])) {
            $formData['background_image'] = $eavData['background_image'];
        } elseif (isset($eavData['image'])) {
            $formData['background_image'] = $eavData['image'];
        }

        $margin = $this->styleExtractor->extractStyle($formData, ['margin']);
        if ($margin) {
            $rootElementAttributes['style'] = $margin;
        }

        $wrapperDivElementAttributes = [
            'data-element' => 'mobile_image',
            'class' => 'pagebuilder-slide-wrapper pagebuilder-mobile-only'
        ];
        $style = $this->styleExtractor->extractStyle($formData);
        if ($style) {
            $wrapperDivElementAttributes['style'] = $style;
        }

        $overlayDivElementAttributes['data-element'] = 'overlay';
        $overlayDivElementAttributes['class'] = 'pagebuilder-overlay pagebuilder-poster-overlay';
        $style = $this->styleExtractor->extractStyle($formData, ['padding']);
        $overlayColor = 'transparent';
        if (isset($eavData['has_overlay']) && $eavData['has_overlay'] == 1) {
            $overlayColor = 'rgba(0,0,0,0.5)';
            if ($style) {
                $style .= ' ';
            }
            $style .= 'background-color: rgba(0,0,0,0.5);';
        }
        $overlayDivElementAttributes['data-overlay-color'] = $overlayColor;
        if ($style) {
            $overlayDivElementAttributes['style'] = $style;
        }

        $buttonElementHtml = '';
        // Advanced slider item only requires link text, slider item requires both
        if (isset($eavData['link_text']) || (isset($eavData['link_url']) && isset($eavData['title_tag']))) {
            $buttonElementHtml = '<button data-element="button" ';
            $buttonElementHtml .= 'type="button" class="pagebuilder-slide-button pagebuilder-button-primary" ';
            $buttonElementHtml .= 'style="opacity: 1; visibility: visible;">';
            $buttonElementHtml .= ($eavData['link_text'] ??  $eavData['title_tag'] ?? '');
            $buttonElementHtml .= '</button>';
        }

        // mobile wrapper div
        $rootElementHtml = '<div' . $this->printAttributes($rootElementAttributes) . '><a';
        $rootElementHtml .= isset($eavData['link_url']) ?
            ' data-element="link" href="' . $eavData['link_url'] . '">' : ' data-element="link">';
        $rootElementHtml .= '<div'
            . $this->printAttributes($wrapperDivElementAttributes)
            . '><div'
            . $this->printAttributes($overlayDivElementAttributes)
            . '><div class="pagebuilder-poster-content">'
            . '<div data-element="content">'
            . '<h3>'
            . ($eavData['title'] ?? $eavData['title_tag'] ?? '')
            . '</h3>'
            . '<div>' . ($eavData['textarea'] ?? '') . '</div></div>'
            . $buttonElementHtml
            . '</div></div></div>';

        // non-mobile wrapper div
        $wrapperDivElementAttributes['data-element'] = 'desktop_image';
        $wrapperDivElementAttributes['class'] = 'pagebuilder-slide-wrapper ' .
            'pagebuilder-mobile-hidden';
        $rootElementHtml .= '<div'
            . $this->printAttributes($wrapperDivElementAttributes)
            . '><div'
            . $this->printAttributes($overlayDivElementAttributes)
            . '><div class="pagebuilder-poster-content">'
            . '<div data-element="content"><h3>'
            . ($eavData['title'] ?? $eavData['title_tag'] ?? '')
            . '</h3>'
            . '<div>' . ($eavData['textarea'] ?? '') . '</div></div>'
            . $buttonElementHtml
            . '</div></div></div>';

        $rootElementHtml .= '</a></div>';

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
