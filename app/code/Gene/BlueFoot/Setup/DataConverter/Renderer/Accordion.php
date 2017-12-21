<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\Renderer;

use Gene\BlueFoot\Setup\DataConverter\RendererInterface;
use Gene\BlueFoot\Setup\DataConverter\EavAttributeLoaderInterface;
use Gene\BlueFoot\Setup\DataConverter\StyleExtractorInterface;
use Magento\Framework\Serialize\Serializer\Json;

/**
 * Render accordions to PageBuilder format
 */
class Accordion implements RendererInterface
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
     * @var EavAttributeLoaderInterface
     */
    private $itemEavAttributeLoader;

    /**
     * @var Json
     */
    private $serializer;

    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader,
        EavAttributeLoaderInterface $itemEavAttributeLoader,
        Json $serializer
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
        $this->itemEavAttributeLoader = $itemEavAttributeLoader;
        $this->serializer = $serializer;
    }

    /**
     * {@inheritdoc}
     */
    public function render(array $itemData, array $additionalData = [])
    {
        $eavData = $this->eavAttributeLoader->load($itemData);

        $rootElementAttributes = [
            'data-role' => 'accordion',
            'data-mage-init' => $this->getMageInitValue($itemData),
            'class' => 'pagebuilder-accordion ' . ($eavData['css_classes'] ?? '')
        ];
        $rootElementAttributes['class'] = rtrim($rootElementAttributes['class']);

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
        $rootElementHtml .= '>' . (isset($additionalData['children']) ? $additionalData['children'] : '') . '</div>';

        return $rootElementHtml;
    }

    /**
     * Get data-mage-init attribute value
     *
     * @param array $itemData
     * @return string
     */
    private function getMageInitValue(array $itemData)
    {
        $children = isset($itemData['children']['accordion_items']) ? $itemData['children']['accordion_items'] : null;
        return htmlentities(
            $this->serializer->serialize(
                [
                    'accordion' => [
                        'active' => !empty($children) ? $this->getActiveItem($children) : [0],
                        'collapsibleElement' => '[data-collapsible=true]',
                        'content' => '[data-content=true]'
                    ]
                ]
            )
        );
    }

    /**
     * Determine which accordion items are active
     *
     * @param array $children
     * @return array
     */
    private function getActiveItem(array $children)
    {
        $active = [];
        foreach ($children as $index => $child) {
            $eavData = $this->itemEavAttributeLoader->load($child);
            if (isset($eavData['open_on_load']) && $eavData['open_on_load']) {
                $active[] = $index;
            }
        }

        if (empty($active)) {
            $active = [0];
        }

        return $active;
    }
}
