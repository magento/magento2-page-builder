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
 * Render map item to PageBuilder format
 */
class Map implements RendererInterface
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
        if (!isset($itemData['entityId'])) {
            throw new \InvalidArgumentException('entityId is missing.');
        }
        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);

        $srcParts = explode(',', $eavData['map'] ?? ',,');
        $srcParts = count($srcParts) === 3 ? $srcParts : ['', '', ''];

        $rootElementAttributes = [
            'data-role' => 'map',
            'class' => $eavData['css_classes'] ?? '',
            'src' => 'https://www.google.com/maps/embed/v1/place?q='
                . $srcParts[0]
                . ','
                . $srcParts[1]
                . '&zoom='
                . $srcParts[2]
                . '&key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw'
        ];

        if (isset($itemData['formData'])) {
            $formData = $itemData['formData'];
            if (isset($eavData['map_width'])) {
                $formData['width'] = $eavData['map_width'];
            }
            if (isset($eavData['map_height'])) {
                $formData['height'] = $eavData['map_height'];
            }

            $style = $this->styleExtractor->extractStyle($formData);
            if ($style) {
                $rootElementAttributes['style'] = $style;
            }
        }

        $rootElementHtml = '<iframe';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue !== '' ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= ' frameborder="0" />';

        return $rootElementHtml;
    }
}
