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

        $rootElementAttributes = [
            'data-role' => 'map',
            'class' => $eavData['css_classes'] ?? '',
        ];

        if (isset($eavData['map'])) {
            $map = explode(',', $eavData['map']);
            $rootElementAttributes['data-markers'] = '[{&quot;lat&quot;:'
                . $map[0]
                . ',&quot;lng&quot;:'
                . $map[1]
                . '}]';
            $rootElementAttributes['data-zoom'] = $map[2];
        }

        if (!isset($eavData['map'])) {
            $rootElementAttributes['data-markers'] = '[]';
        }

        if (isset($itemData['formData'])) {
            $formData = $itemData['formData'];
            $formData['width'] = $eavData['map_width'] ?? '100%';
            $formData['height'] = $eavData['map_height'] ?? '300px';

            $style = $this->styleExtractor->extractStyle($formData);
            if ($style) {
                if (isset($eavData['map'])) {
                    $style .= ' display: inline-block;';
                } else {
                    $style .= ' display: none;';
                }
                $rootElementAttributes['style'] = $style;
            }
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue !== '' ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '></div>';

        return $rootElementHtml;
    }
}
