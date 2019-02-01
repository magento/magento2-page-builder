<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Setup\DataConverter\Renderer;

use Magento\PageBuilderDataMigration\Setup\DataConverter\RendererInterface;
use Magento\PageBuilderDataMigration\Setup\DataConverter\EavAttributeLoaderInterface;
use Magento\PageBuilderDataMigration\Setup\DataConverter\StyleExtractorInterface;

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

    /**
     * @param StyleExtractorInterface $styleExtractor
     * @param EavAttributeLoaderInterface $eavAttributeLoader
     */
    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
    }

    /**
     * @inheritdoc
     *
     * @throws \Magento\Framework\Exception\NoSuchEntityException
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
        $backgroundImages = '';
        $backgroundImagesAttr = '{}';

        if (isset($eavData['background_image'])) {
            $backgroundImages = $eavData['background_image'];
        } elseif (isset($eavData['image'])) {
            $backgroundImages = $eavData['image'];
        }

        if ($backgroundImages) {
            $backgroundImagesAttr = '{\&quot;'
                . 'desktop_image\&quot;:\&quot;'
                . '{{media url=wysiwyg'
                . $backgroundImages
                . '}}\&quot;,\&quot;'
                . 'mobile_image\&quot;:\&quot;'
                . '{}\&quot;}';
        }

        $margin = $this->styleExtractor->extractStyle($formData, ['margin']);
        if ($margin) {
            $rootElementAttributes['style'] = $margin;
        }

        $wrapperDivElementAttributes = [
            'data-element' => 'wrapper',
            'data-background-images' => $backgroundImagesAttr,
            'class' => 'pagebuilder-slide-wrapper'
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
        $linkNodeName = isset($eavData['link_url']) ? 'a' : 'div';
        $linkDataElementName = isset($eavData['link_url']) ? 'link' : 'empty_link';

        $rootElementHtml = '<div' . $this->printAttributes($rootElementAttributes) . '>';
        $rootElementHtml .= '<' . $linkNodeName . ' data-element="' . $linkDataElementName . '"';
        $rootElementHtml .= isset($eavData['link_url']) ? ' href="' . $eavData['link_url'] . '">' : '>';
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

        $rootElementHtml .= '</' . $linkNodeName . '></div>';

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
