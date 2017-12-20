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
 * Render code to PageBuilder format
 */
class Newsletter implements RendererInterface
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
        $eavData = $this->eavAttributeLoader->hydrate($itemData);

        $rootElementAttributes = [
            'data-role' => 'newsletter',
            'class' => $itemData['formData']['css_classes'] ?? '',
            'data-button-text' => isset($eavData['button_text']) ? $eavData['button_text'] : '',
            'data-label-text' => isset($eavData['label']) ? $eavData['label'] : '',
            'data-title' => isset($eavData['title']) ? $eavData['title'] : '',
            'data-placeholder' => isset($eavData['placeholder']) ? $eavData['placeholder'] : '',
        ];

        $style = $this->styleExtractor->extractStyle($itemData['formData']);
        if ($style) {
            $rootElementAttributes['style'] = $style;
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }

        $rootElementHtml .= '></div>';

        return $rootElementHtml;
    }
}
