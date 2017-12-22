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
     */
    public function render(array $itemData, array $additionalData = [])
    {
        if (!isset($itemData['entityId'])) {
            throw new \InvalidArgumentException('entityId is missing.');
        }
        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);

        $cssClasses = $eavData['css_classes'] ?? '';
        $cssClasses .= isset($eavData['css_classes']) ? ' pagebuilder-slider' : 'pagebuilder-slider';

        $rootElementAttributes = [
            'data-role' => 'slide',
            'class' => $cssClasses
        ];

        $formData = $itemData['formData'] ?? [];
        $formData['background_image'] = isset($eavData['image']) ? $eavData['image'] : '';

        $style = $this->styleExtractor->extractStyle($formData);
        if ($style) {
            $rootElementAttributes['style'] = $style;
        }

        $rootElementHtml = '<div' . $this->printAttributes($rootElementAttributes);

        $innerDivElement1Attributes = [];
        if (isset($formData['align']) && $formData['align']) {
            $innerDivElement1Attributes['style'] = 'text-align: ' . $formData['align'] . ';';
        }

        $rootElementHtml .= '><div'
            . $this->printAttributes($innerDivElement1Attributes)
            . '><div';

        $innerDivElement2Attributes = [];
        if (isset($formData['align']) && $formData['align']) {
            $innerDivElement2Attributes['style'] = 'text-align: ' . $formData['align'] . ';';
        }
        $innerDivElement2Attributes['class'] = 'pagebuilder-content';

        $rootElementHtml .= $this->printAttributes($innerDivElement2Attributes)
            . '><h3>'
            . ($eavData['title_tag'] ?? '')
            . '</h3><div class="slider-content">'
            . '</div>';
        if (isset($eavData['link_text']) && isset($eavData['title_tag'])) {
            $rootElementHtml .= '<a class="button" href="'
                . $eavData['link_url']
                . '"><span><span>'
                . $eavData['title_tag']
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
