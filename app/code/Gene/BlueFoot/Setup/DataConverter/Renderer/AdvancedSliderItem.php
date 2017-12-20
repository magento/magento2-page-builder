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
     */
    public function render(array $itemData, array $additionalData = [])
    {
        $eavData = $this->eavAttributeLoader->hydrate($itemData);

        $cssClasses = $eavData['css_classes'] ?? '';
        $cssClasses .= isset($eavData['css_classes']) ? ' pagebuilder-slider' : 'pagebuilder-slider';

        $rootElementAttributes = [
            'data-role' => 'slide',
            'class' => $cssClasses
        ];

        $formData = $itemData['formData'];
        $formData['background_image'] = isset($eavData['background_image']) ? $eavData['background_image'] : '';

        $style = $this->styleExtractor->extractStyle($formData);
        if ($style) {
            $rootElementAttributes['style'] = $style;
        }

        $rootElementHtml = '<div' . $this->printAttributes($rootElementAttributes);

        $innerDivElement1Attributes = [];
        if ($formData['align']) {
            $innerDivElement1Attributes['style'] = 'text-align: ' . $formData['align'] . ';';
        }

        $rootElementHtml .= '><div'
            . $this->printAttributes($innerDivElement1Attributes)
            . '><div';

        $innerDivElement2Attributes = [];
        if ($formData['align']) {
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
            . $eavData['title']
            . '</h3><div class="slider-content">'
            . $eavData['textarea']
            . '</div>';
        if (isset($eavData['link_text'])) {
            $rootElementHtml .= '<a class="button" href="'
                . $eavData['link_url']
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
