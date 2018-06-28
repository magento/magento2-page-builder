<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Setup\DataConverter\Renderer;

use Magento\PageBuilder\Setup\DataConverter\RendererInterface;
use Magento\PageBuilder\Setup\DataConverter\StyleExtractorInterface;

/**
 * Render column to PageBuilder format
 */
class Column implements RendererInterface
{
    // Defined column mapping to supported widths
    const COLUMN_WIDTH_MAPPING = [
        '0.250' => '0.167',
        '0.750' => '0.833'
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
    public function render(array $itemData, array $additionalData = []) : string
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
    private function calculateColumnWidth($oldWidth) : string
    {
        // Map column sizes to suitable sizes for columns we don't yet support
        if (isset(self::COLUMN_WIDTH_MAPPING[$oldWidth])) {
            $oldWidth = self::COLUMN_WIDTH_MAPPING[$oldWidth];
        }

        // Resolve issues with old system storing non exact percentages (e.g. 0.167 != 16.6667%)
        $percentage = 100 / round(100 / ($oldWidth * 100), 1);
        return floatval(number_format($percentage, 4, '.', '')) . '%';
    }
}
