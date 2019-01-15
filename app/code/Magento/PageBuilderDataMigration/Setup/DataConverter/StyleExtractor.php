<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Setup\DataConverter;

use Magento\Framework\Serialize\Serializer\Json;

/**
 * Extract and convert styles from a data array into value style string
 */
class StyleExtractor implements StyleExtractorInterface
{
    /**
     * @var Json
     */
    private $serializer;

    /**
     * @var ColorConverter
     */
    private $colorConverter;

    public function __construct(
        Json $serializer,
        ColorConverter $colorConverter
    ) {
        $this->serializer = $serializer;
        $this->colorConverter = $colorConverter;
    }

    /**
     * @inheritdoc
     *
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    public function extractStyle(array $formData, array $stylesToExtract = []) : string
    {
        $styleAttributes = [
            'text-align' => isset($formData['align']) ? $formData['align'] : '',
            'width' => isset($formData['width']) ? $this->normalizeSizeDimension($formData['width']) : '',
            'height' => isset($formData['height']) ? $this->normalizeSizeDimension($formData['height']) : '',
            'background-color' => isset($formData['background_color'])
                ? $this->colorConverter->convert($formData['background_color']) : '',
            'background-image' => !empty($formData['background_image'])
                ? ('url(\'{{media url=wysiwyg' . $formData['background_image'] . '}}\')') : '',
            'border-color' => isset($formData['border_color'])
                ? $this->colorConverter->convert($formData['border_color']) : '',
            'border-width' => $formData['border_width'] ?? '',
            'display' => $formData['display'] ?? ''
        ];

        if (isset($formData['metric']) && $formData['metric']) {
            $metric = $this->serializer->unserialize($formData['metric']);
            $styleAttributes['margin'] = isset($metric['margin']) ?
                $this->extractMarginPadding($metric['margin']) : '';
            $styleAttributes['padding'] = isset($metric['padding']) ?
                $this->extractMarginPadding($metric['padding']) : '';
        }

        // Only return specific styles based on key
        if (!empty($stylesToExtract)) {
            $styleAttributes = array_intersect_key($styleAttributes, array_fill_keys($stylesToExtract, null));
        }

        $styleString = '';
        foreach ($styleAttributes as $attributeName => $attributeValue) {
            if ($attributeValue) {
                $styleString .= "$attributeName: $attributeValue; ";
            }
        }

        return rtrim($styleString, ' ');
    }

    /**
     * Normalize value for width/height
     *
     * @param string $value
     * @return string
     */
    private function normalizeSizeDimension($value) : string
    {
        if (strpos($value, 'px') !== false || strpos($value, '%') !== false) {
            return $value;
        }
        return ($value * 100) . '%';
    }

    /**
     * Transform data to valid CSS string
     *
     * @param string $attributeData
     * @return string
     */
    private function extractMarginPadding(string $attributeData) : string
    {
        $valuesArray = explode(' ', $attributeData);
        $convertedValuesArray = array_map(function ($value) {
            return $value === '-' ? '0px' : $value;
        }, $valuesArray);

        return implode($convertedValuesArray, ' ');
    }
}
