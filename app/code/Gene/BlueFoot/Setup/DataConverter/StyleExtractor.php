<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

class StyleExtractor implements StyleExtractorInterface
{
    /**
     * @inheritdoc
     */
    public function extractStyle(array $formData)
    {
        $styleAttributes = [
            'text-align' => $formData['align'],
            'margin' => isset($formData['metric']['margin']) ?
                $this->extractMarginPadding($formData['metric']['margin']) : '',
            'padding' => isset($formData['metric']['padding']) ?
                $this->extractMarginPadding($formData['metric']['padding']) : '',
            'width' => isset($formData['width']) ? ($formData['width'] * 100) . '%' : ''
        ];

        $styleString = '';
        foreach ($styleAttributes as $attributeName => $attributeValue) {
            if ($attributeValue) {
                $styleString .= "$attributeName: $attributeValue; ";
            }
        }

        return rtrim($styleString);
    }

    /**
     * Transform data to valid CSS string
     *
     * @param string $attributeData
     * @return string
     */
    private function extractMarginPadding(string $attributeData)
    {
        $valuesArray = explode(' ', $attributeData);
        $convertedValuesArray = array_map(function ($value) {
            return $value === '-' ? '0px' : $value;
        }, $valuesArray);

        return implode($convertedValuesArray, ' ');
    }
}
