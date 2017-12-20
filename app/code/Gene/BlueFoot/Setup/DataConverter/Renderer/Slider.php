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
 * Render slider to PageBuilder format
 */
class Slider implements RendererInterface
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
            'data-role' => 'advanced-slider',
            'data-autoplay' => isset($eavData['autoplay']) ? $eavData['autoplay'] : '',
            'data-autoplay-speed' => isset($eavData['autoplay_speed']) ? $eavData['autoplay_speed'] : '',
            'data-fade' => isset($eavData['fade']) ? $eavData['fade'] : '',
            'data-is-infinite' => isset($eavData['is_infinite']) ? $eavData['is_infinite'] : '',
            'data-show-arrows' => isset($eavData['show_arrows']) ? $eavData['show_arrows'] : '',
            'data-show-dots' => isset($eavData['show_dots']) ? $eavData['show_dots'] : '',
            'data-slides-to-scroll' => isset($eavData['slides_to_scroll']) ? $eavData['slides_to_scroll'] : '',
            'data-slides-to-show' => isset($eavData['slides_to_show']) ? $eavData['slides_to_show'] : '',
            'data-advanced-settings' => isset($eavData['slider_advanced_settings'])
                ? $eavData['slider_advanced_settings'] : '',
            'class' => $itemData['formData']['css_classes'] ?? '',
        ];

        $style = $this->styleExtractor->extractStyle($itemData['formData']);
        if ($style) {
            $rootElementAttributes['style'] = $style;
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue !== '' ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '>' . $additionalData['children'] . '</div>';

        return $rootElementHtml;
    }
}
