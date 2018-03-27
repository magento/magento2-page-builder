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
    public function render(array $itemData, array $additionalData = [])
    {
        if (!isset($itemData['entityId'])) {
            throw new \InvalidArgumentException('entityId is missing.');
        }
        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);

        $rootElementAttributes = [
            'data-role' => 'slide',
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
            'class' => 'pagebuilder-slide-wrapper pagebuilder-mobile-only'
        ];
        $style = $this->styleExtractor->extractStyle($formData);
        if ($style) {
            $wrapperDivElementAttributes['style'] = $style;
        }

        $overlayDivElementAttributes['class'] = 'pagebuilder-overlay pagebuilder-poster-overlay';
        $style = $this->styleExtractor->extractStyle($formData, ['padding']);

        if (isset($eavData['has_overlay']) && $eavData['has_overlay'] == 1) {
            $overlayDivElementAttributes['data-overlay-color'] = 'rgba(0,0,0,0.5)';   // default overlay style
            if ($style) {
                $style .= ' ';
            }
            $style .= 'background-color: rgba(0,0,0,0.5);';
        }
        if ($style) {
            $overlayDivElementAttributes['style'] = $style;
        }

        $buttonElementHtml = '';
        if (isset($eavData['link_text'])) {
            $buttonElementHtml =  '<button type="button" class="pagebuilder-slide-button pagebuilder-button-primary" ';
            $buttonElementHtml .= 'style="opacity: 1; visibility: visible;">' . $eavData['link_text'];
            $buttonElementHtml .= '</button>';
        }

        // mobile wrapper div
        $rootElementHtml = '<div' . $this->printAttributes($rootElementAttributes);
        $rootElementHtml .= '><a';
        $rootElementHtml .= isset($eavData['link_url']) ? ' href="' . $eavData['link_url'] . '">' : '>';
        $rootElementHtml .= '<div'
            . $this->printAttributes($wrapperDivElementAttributes)
            . '><div'
            . $this->printAttributes($overlayDivElementAttributes)
            . '><div class="pagebuilder-poster-content">'
            . '<h3>'
            . ($eavData['title'] ?? '')
            . '</h3>'
            . '<div>' . ($eavData['textarea'] ?? '') . '</div>'
            . $buttonElementHtml
            . '</div></div></div>';

        // non-mobile wrapper div
        $wrapperDivElementAttributes['class'] = 'pagebuilder-slide-wrapper ' .
            'pagebuilder-mobile-hidden';
        $rootElementHtml .= '<div'
            . $this->printAttributes($wrapperDivElementAttributes)
            . '><div'
            . $this->printAttributes($overlayDivElementAttributes)
            . '><div class="pagebuilder-poster-content">'
            . '<h3>'
            . ($eavData['title'] ?? '')
            . '</h3>'
            . '<div>' . ($eavData['textarea'] ?? '') . '</div>'
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
