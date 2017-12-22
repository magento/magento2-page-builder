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
 * Render tabs to PageBuilder format
 */
class Tabs implements RendererInterface
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
            'data-role' => 'tabs',
            'class' => $eavData['css_classes'] ?? ''
        ];

        if (isset($itemData['formData'])) {
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $rootElementAttributes['style'] = $style;
            }
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '><div class="product data items" data-mage-init="'
            . $this->getMageInitValue()
            . '">'
            . (isset($additionalData['children']) ? $additionalData['children'] : '')
            . '</div></div>';

        return $rootElementHtml;
    }

    /**
     * Get data-mage-init attribute value
     *
     * @return string
     */
    private function getMageInitValue()
    {
        return '{&quot;tabs&quot;:{&quot;openedState&quot;:' .
            '&quot;active&quot;,&quot;collapsibleElement&quot;:&quot;[data-collapsible=true]&quot;,' .
            '&quot;content&quot;:&quot;[data-content=true]&quot;}}';
    }
}
