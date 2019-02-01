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

    /**
     * @var array
     */
    private $rootElementAttributes;

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

        $this->rootElementAttributes = [
            'data-element' => 'main',
            'data-role' => 'map',
            'data-appearance' => 'default',
            'class' => $eavData['css_classes'] ?? '',
            'data-show-controls' => 'true',
            'data-locations' => '[]',
        ];

        $this->renderMapLocations($eavData);

        if (isset($itemData['formData'])) {
            $formData = $itemData['formData'];
            $formData['height'] = $eavData['map_height']
                && strpos($eavData['map_height'], '%') === false
                ? $eavData['map_height'] : '300px';

            $style = $this->styleExtractor->extractStyle($formData);
            if ($style) {
                $this->rootElementAttributes['style'] = $style;
            }
        }

        $rootElementHtml = '<div';
        foreach ($this->rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue !== '' ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '></div>';

        return $rootElementHtml;
    }

    /**
     * Extract and render Map Location data from EAV
     *
     * @param array $eavData
     *
     * @return void
     */
    private function renderMapLocations($eavData) : void
    {
        if (isset($eavData['map'])) {
            $map = explode(',', $eavData['map']);
            $this->rootElementAttributes['data-locations'] = '[{&quot;position&quot;:{&quot;latitude&quot;:'
                . $map[0]
                . ',&quot;longitude&quot;:'
                . $map[1]
                . '}}]';
        }
    }
}
