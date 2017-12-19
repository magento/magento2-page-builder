<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\Renderer;

use Gene\BlueFoot\Setup\DataConverter\RendererInterface;
use Gene\BlueFoot\Setup\DataConverter\EntityHydratorInterface;
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
     * @var EntityHydratorInterface
     */
    private $entityHydrator;

    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EntityHydratorInterface $entityHydrator
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->entityHydrator = $entityHydrator;
    }

    /**
     * {@inheritdoc}
     */
    public function render(array $itemData, array $additionalData = [])
    {
        $eavData = $this->entityHydrator->hydrate($itemData);

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

        $style = $this->styleExtractor->extractStyle($itemData['formData']);
        if ($style) {
            $rootElementAttributes['style'] = $eavStyle . $style;
        } else {
            if ($eavStyle != '') {
                $rootElementAttributes['style'] = $eavStyle;
            }
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
