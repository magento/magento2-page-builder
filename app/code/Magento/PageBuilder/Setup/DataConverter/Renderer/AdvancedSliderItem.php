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

        $rootElementAttributes = [
            'data-role' => 'slide',
            'class' => 'pagebuilder-slide'
        ];

        $rootElementHtml = '<div' . $this->printAttributes($rootElementAttributes);

        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);

        $cssClasses = $eavData['css_classes'] ?? '';

        $innerDivElement1Attributes = [
            'class' => $cssClasses
        ];

        $formData = $itemData['formData'] ?? [];
        $formData['background_image'] = isset($eavData['background_image']) ? $eavData['background_image'] : '';

        $style = $this->styleExtractor->extractStyle($formData);
        if ($style) {
            $innerDivElement1Attributes['style'] = $style;
        }

        $rootElementHtml .= '><div'
            . $this->printAttributes($innerDivElement1Attributes)
            . '><div';

        $innerDivElement2Attributes = [];
        if (isset($formData['align']) && $formData['align']) {
            $innerDivElement2Attributes['style'] = 'text-align: ' . $formData['align'] . ';';
        }
        $innerDivElement2AttributeCssClasses = '';
        if ($eavData['has_overlay']) {
            $innerDivElement2AttributeCssClasses = 'has-background-overlay ';
        }
        $innerDivElement2AttributeCssClasses .= 'pagebuilder-content';
        $innerDivElement2Attributes['class'] = $innerDivElement2AttributeCssClasses;

        $rootElementHtml .= $this->printAttributes($innerDivElement2Attributes)
            . '><h3>'
            . ($eavData['title'] ?? '')
            . '</h3><div class="slider-content">'
            . ($eavData['textarea'] ?? '')
            . '</div>';
        if (isset($eavData['link_text'])) {
            $rootElementHtml .= '<a class="button" href="'
                . ($eavData['link_url'] ?? '')
                . '"><span><span>'
                . $eavData['link_text']
                . '</span></span></a>';
        }
        $rootElementHtml .= '</div></div></div>';

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
