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
        $rootElementHtml .= '>' . $this->getMageInit();

        $rootElementHtml .= (isset($additionalData['children']) ? $additionalData['children'] : '') . '</div></div>';

        return $this->replaceTabIds($rootElementHtml);
    }

    private function getMageInit() {
        return '<div class="product data items" data-mage-init="{&quot;tabs&quot;:{&quot;openedState&quot;:' .
            '&quot;active&quot;,&quot;collapsibleElement&quot;:&quot;[data-collapsible=true]&quot;,' .
            '&quot;content&quot;:&quot;[data-content=true]&quot;}}">';
    }
    private function replaceTabIds($rootElementHtml) {
        $count = substr_count($rootElementHtml, 'pagebuilder_tab');
        $tab_count = 0;
        for ($i = $count; $i > 0; $i-=2) {
            $rootElementHtml = preg_replace(
                '/pagebuilder_tab"/',
                'pagebuilder_tab' . $tab_count . '"',
                $rootElementHtml,
                2
            );
            $tab_count++;
        }
        return $rootElementHtml;
    }
}
