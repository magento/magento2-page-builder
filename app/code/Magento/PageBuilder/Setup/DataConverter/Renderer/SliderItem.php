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
class SliderItem implements RendererInterface
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
            'data-title' => $eavData['title_tag'] ?? '',
            'class' => $eavData['css_classes'] ?? ''
        ];

        $formData = $itemData['formData'] ?? [];
        $formData['background_image'] = $eavData['image'] ?? '';

        $margin = $this->styleExtractor->extractMargin($formData);
        if ($margin) {
            $rootElementAttributes['style'] = $margin;
        }

        $wrapperDivElementAttributes = [
            'class' => 'pagebuilder-slide-wrapper pagebuilder-slide-mobile pagebuilder-mobile-only'
        ];
        $style = $this->styleExtractor->extractStyle($formData);
        if ($style) {
            $wrapperDivElementAttributes['style'] = $style;
        }

        $overlayDivElementAttributes['class'] = 'pagebuilder-overlay pagebuilder-poster-overlay';
        $padding = $this->styleExtractor->extractPadding($formData);
        if ($padding) {
            $overlayDivElementAttributes['style'] = $padding;
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
            . ($eavData['title_tag'] ?? '')
            . '</h3>'
            . '<div></div>'
            . '</div></div></div>';

        // non-mobile wrapper div
        $wrapperDivElementAttributes['class'] = 'pagebuilder-slide-wrapper pagebuilder-slide-image pagebuilder-mobile-hidden';
        $rootElementHtml .= '<div'
            . $this->printAttributes($wrapperDivElementAttributes)
            . '><div'
            . $this->printAttributes($overlayDivElementAttributes)
            . '><div class="pagebuilder-poster-content">'
            . '<h3>'
            . ($eavData['title_tag'] ?? '')
            . '</h3>'
            . '<div></div>'
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
