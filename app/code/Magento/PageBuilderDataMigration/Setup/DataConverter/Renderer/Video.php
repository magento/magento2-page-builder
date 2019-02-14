<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Setup\DataConverter\Renderer;

use Magento\PageBuilderDataMigration\Setup\DataConverter\RendererInterface;
use Magento\PageBuilderDataMigration\Setup\DataConverter\EavAttributeLoaderInterface;
use Magento\PageBuilderDataMigration\Setup\DataConverter\StyleExtractorInterface;

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

    /**
     * @param StyleExtractorInterface $styleExtractor
     * @param EavAttributeLoaderInterface $eavAttributeLoader
     */
    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
    }

    /**
     * @inheritdoc
     *
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function render(array $itemData, array $additionalData = []) : string
    {
        if (!isset($itemData['entityId'])) {
            throw new \InvalidArgumentException('entityId is missing.');
        }
        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);
        $formData = $itemData['formData'] ?? [];

        $rootAttributes = $this->getRootElementAttributes($eavData, $formData);
        $wrapperAttributes = $this->getWrapperElementAttributes($eavData, $formData);
        $iframeAttributes = $this->getIframeAttributes($eavData);

        $rootElementOpenTag = $this->createOpenTagWithAttributes('div', $rootAttributes);
        $wrapperElementOpenTag = $this->createOpenTagWithAttributes('div', $wrapperAttributes);
        $iframeContainer = $this->createOpenTagWithAttributes('div', ['class' => 'pagebuilder-video-container']);
        $iframeOpenTag = $this->createOpenTagWithAttributes('iframe', $iframeAttributes);

        return $rootElementOpenTag . $wrapperElementOpenTag . $iframeContainer . $iframeOpenTag
            . '</iframe></div></div></div>';
    }

    /**
     * Creates an open tag with the given name and attributes
     *
     * @param string $elementName
     * @param array $attributes
     * @return string
     */
    private function createOpenTagWithAttributes(string $elementName, array $attributes): string
    {
        $elementHtml = '<' . $elementName;
        foreach ($attributes as $attributeName => $attributeValue) {
            $elementHtml .= ' ' . $attributeName . (isset($attributeValue) ? '="' . $attributeValue . '"' : '');
        }
        return $elementHtml . '>';
    }

    /**
     * Get attributes, style, and classes for the root element
     *
     * @param array $eavData
     * @param array $formData
     * @return array
     */
    private function getRootElementAttributes(array $eavData, array $formData): array
    {
        $attributes = [
            'data-element' => 'main',
            'data-content-type' => 'video',
            'data-appearance' => 'default',
            'class' => $eavData['css_classes'] ?? ''
        ];

        $justifyMap = [
            'left' => 'flex-start',
            'center' => 'center',
            'right' => 'flex-end'
        ];

        if (isset($formData['align']) && isset($justifyMap[$formData['align']])) {
            $attributes['style'] = 'justify-content: ' . $justifyMap[$formData['align']] . ';';
            unset($formData['align']);
        }

        return $attributes;
    }

    /**
     * Get attributes, style, and classes for the wrapper
     *
     * @param array $eavData
     * @param array $formData
     * @return array
     */
    private function getWrapperElementAttributes(array $eavData, array $formData): array
    {
        $attributes = [
            'data-element' => 'wrapper',
            'class' => 'pagebuilder-video-wrapper'
        ];

        $style = $this->styleExtractor->extractStyle($formData);

        if (isset($eavData['video_width'])) {
            $style .= 'max-width: ' . $this->normalizeSizeDimension($eavData['video_width']) . ';';
        }

        if ($style) {
            $attributes['style'] = $style;
        }

        return $attributes;
    }

    /**
     * Get attributes, style, and classes for the iframe
     *
     * @param array $eavData
     * @return array
     */
    private function getIframeAttributes(array $eavData): array
    {
        $attributes = [
            'data-element' => 'video',
            'src' => $eavData['video_url'],
            'frameborder' => '0',
            'allowfullscreen' => null
        ];

        return $attributes;
    }

    /**
     * Normalize value for width
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
