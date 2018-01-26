<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter\Renderer;

use Magento\PageBuilder\Setup\DataConverter\RendererInterface;
use Magento\PageBuilder\Setup\DataConverter\StyleExtractorInterface;

/**
 * Render column to PageBuilder format
 */
class Column implements RendererInterface
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
            'data-role' => 'column',
            'class' => $itemData['formData']['css_classes'] ?? '',
        ];

        if (isset($itemData['formData'])) {
            // Map column sizes to suitable sizes for columns we don't yet support
            $columnWidthMapping = [
                '0.250' => '0.167',
                '0.750' => '0.825'
            ];

            if (isset($itemData['formData']['width'])
                && isset($columnWidthMapping[$itemData['formData']['width']])
            ) {
                $itemData['formData']['width'] = $columnWidthMapping[$itemData['formData']['width']];
            }

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
}
