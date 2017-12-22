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
 * Render video to PageBuilder format
 */
class Video implements RendererInterface
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
            'data-role' => 'video',
            'class' => $eavData['css_classes'] ?? '',
            'src' => $eavData['video_url']
        ];

        $formData = $itemData['formData'] ?? [];
        if (isset($eavData['video_width'])) {
            $formData['width'] = $this->normalizeSizeDimension($eavData['video_width']);
        }

        if (isset($eavData['video_width'])) {
            $formData['height'] = $this->normalizeSizeDimension($eavData['video_height']);
        }

        $style = $this->styleExtractor->extractStyle($formData);
        if ($style) {
            $rootElementAttributes['style'] = $style;
        }

        $rootElementHtml = '<iframe frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '></iframe>';

        return $rootElementHtml;
    }

    /**
     * Normalize value for width/height
     *
     * @param string $value
     * @return string
     */
    private function normalizeSizeDimension($value)
    {
        if (strpos($value, 'px') !== false || strpos($value, '%') !== false) {
            return $value;
        }
        return '100%';
    }
}
