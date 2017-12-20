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
        $eavData = $this->eavAttributeLoader->hydrate($itemData);

        $rootElementAttributes = [
            'data-role' => 'video',
            'class' => $eavData['css_classes'] ?? ''
        ];

        $eavStyle = '';
        if (isset($eavData['video_width'])) {
            $eavStyle .= 'width: ' . $eavData['video_width'] . "; ";
        }

        if (isset($eavData['video_height'])) {
            $eavStyle .= 'height: ' . $eavData['video_height'] . "; ";
        }
        $rootElementAttributes['style'] = $eavStyle;

        $style = $this->styleExtractor->extractStyle($itemData['formData']);
        if ($style) {
            $rootElementAttributes['style'] .= $style;
        }
        $rootElementAttributes['style'] = rtrim($rootElementAttributes['style']);

        $rootElementHtml = '<iframe frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= ' src="' . $eavData['video_url'] . '">';
        $rootElementHtml .= '</iframe>';

        return $rootElementHtml;
    }
}
