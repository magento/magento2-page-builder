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
    // We have to map as we are unable to calculate the new column width effectively for all sizes
    const COLUMN_WIDTH_MAPPING = [
        '0.167' => '16.6667',
        '0.250' => '25',
        '0.333' => '33.3333',
        '0.500' => '50',
        '0.666' => '66.6666',
        '0.750' => '75',
        '0.825' => '82.5000',
        '1.000' => '100',
    ];

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
        if (!isset($itemData['formData']['width'])) {
            throw new \InvalidArgumentException('Width is required to migrate column.');
        }

        $rootElementAttributes = [
            'data-role' => 'column',
            'data-appearance' => 'full-height',
            'class' => $itemData['formData']['css_classes'] ?? '',
            'style' => '',
        ];

        if (isset($itemData['formData'])) {
            $width = $itemData['formData']['width'];
            unset($itemData['formData']['width']);
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $rootElementAttributes['style'] = $style;
            }
            $rootElementAttributes['style'] .= ' width: ' . $this->calculateColumnWidth($width) . ';';
            $rootElementAttributes['style'] = trim($rootElementAttributes['style']);
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '>' . (isset($additionalData['children']) ? $additionalData['children'] : '') . '</div>';

        return $rootElementHtml;
    }

    /**
     * Calculate the column width to 4 decimal places
     *
     * @param $oldWidth
     *
     * @return string
     */
    private function calculateColumnWidth($oldWidth)
    {
        if (!isset(self::COLUMN_WIDTH_MAPPING[number_format($oldWidth, 3)])) {
            throw new \InvalidArgumentException('Width ' . $oldWidth .' has no valid mapping.');
        }

        return self::COLUMN_WIDTH_MAPPING[number_format($oldWidth, 3)] . '%';
    }
}
