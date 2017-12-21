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
 * Render tab item to PageBuilder format
 */
class TabsItem implements RendererInterface
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

        $cssClasses = $eavData['css_classes'] ?? '';
        $cssClasses .= isset($eavData['css_classes']) ? ' data item title' : 'data item title';

        $rootElementAttributes = [
            'class' => $cssClasses
        ];

        if (isset($itemData['formData'])) {
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $rootElementAttributes['style'] = $style;
            }
        }

        $rootElementHtml = '<div data-collapsible="true"';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }

        $tabIndex = 'pagebuilder_tab' . ($additionalData['childIndex'] ?? '');

        $rootElementHtml .= '><a class="data switch" tabindex="-1" data-toggle="switch" href="#'
            . $tabIndex
            . '">'
            . $eavData['title']
            . '</a></div>'
            . '<div class="data item content" data-content="true" id="'
            . $tabIndex
            . '">'
            . $eavData['textarea']
            . '</div>';

        return $rootElementHtml;
    }
}
