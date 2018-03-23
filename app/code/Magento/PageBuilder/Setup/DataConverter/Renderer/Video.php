<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter\Renderer;

use Magento\PageBuilder\Setup\DataConverter\RendererInterface;
use Magento\PageBuilder\Setup\DataConverter\EavAttributeLoaderInterface;
use Magento\PageBuilder\Setup\DataConverter\StyleExtractorInterface;

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
     *
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    public function render(array $itemData, array $additionalData = [])
    {
        if (!isset($itemData['entityId'])) {
            throw new \InvalidArgumentException('entityId is missing.');
        }
        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);

        $rootElementAttributes = [
            'data-role' => 'video'
        ];

        $iframeElementAttributes = [
            'class' => $eavData['css_classes'] ?? '',
            'src' => $eavData['video_url']
        ];

        $formData = $itemData['formData'] ?? [];
        if (isset($eavData['video_width'])) {
            $iframeElementAttributes['width'] = $this->normalizeSizeDimension($eavData['video_width']);
        }

        if (isset($eavData['video_height'])) {
            $iframeElementAttributes['height'] = $this->normalizeSizeDimension($eavData['video_height']);
        }

        if (isset($formData['align']) && $formData['align'] !== '') {
            $rootElementAttributes['style'] = 'text-align: ' . $formData['align'] . ';';
            unset($formData['align']);
        }

        $style = $this->styleExtractor->extractStyle($formData);
        if ($style) {
            $iframeElementAttributes['style'] = $style;
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '><iframe frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen';
        foreach ($iframeElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '></iframe></div>';

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
