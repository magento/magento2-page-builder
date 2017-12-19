<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

use Magento\Framework\Serialize\Serializer\Json;

class StyleExtractor implements StyleExtractorInterface
{
    /**
     * @var Json
     */
    private $serializer;

    public function __construct(
        Json $serializer
    ) {
        $this->serializer = $serializer;
    }

    /**
     * @inheritdoc
     */
    public function extractStyle(array $formData)
    {
        $styleAttributes = [
            'text-align' => isset($formData['align']) ? $formData['align'] : '',
            'width' => isset($formData['width']) ? ($formData['width'] * 100) . '%' : '',
            'background-color' => isset($formData['background_color'])
                ? '#' . $formData['background_color'] : '',
            'background-image' => !empty($formData['background_image'])
                ? ('{{media url=' . $formData['background_image'] . '}}') : ''
        ];
        if (isset($formData['metric']) && $formData['metric']) {
            $metric = $this->serializer->unserialize($formData['metric']);
            $styleAttributes['margin'] = isset($metric['margin']) ?
                $this->extractMarginPadding($metric['margin']) : '';
            $styleAttributes['padding'] = isset($metric['padding']) ?
                $this->extractMarginPadding($metric['padding']) : '';
        }

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
