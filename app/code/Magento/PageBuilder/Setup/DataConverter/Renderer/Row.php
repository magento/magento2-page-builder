<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\Renderer;

use Gene\BlueFoot\Setup\DataConverter\RendererInterface;
use Gene\BlueFoot\Setup\DataConverter\StyleExtractorInterface;

/**
 * Render row to PageBuilder format
 */
class Row implements RendererInterface
{
    /**
     * @var StyleExtractorInterface
     */
    private $styleExtractor;

    public function __construct(StyleExtractorInterface $styleExtractor)
    {
        $this->styleExtractor = $styleExtractor;
    }

    /**
     * {@inheritdoc}
     */
    public function render(array $itemData, array $additionalData = [])
    {
        $rootElementAttributes = [
            'data-role' => 'row',
            'class' => $itemData['formData']['css_classes'] ?? '',
        ];

        $formData = $itemData['formData'] ?? [];

        if (!empty($itemData['children'])) {
            $columnChildrenCount = array_reduce($itemData['children'], function ($result, $child) {
                if (isset($child['type']) && $child['type'] === 'column') {
                    $result++;
                }
                return $result;
            }, 0);

            if ($columnChildrenCount === count($itemData['children'])) {
                $formData['display'] = 'flex';
            }
        }

        $style = $this->styleExtractor->extractStyle($formData);
        if ($style) {
            $rootElementAttributes['style'] = $style;
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $attributeValue = trim($attributeValue);
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '>' . (isset($additionalData['children']) ? $additionalData['children'] : '') . '</div>';

        return $rootElementHtml;
    }
}
