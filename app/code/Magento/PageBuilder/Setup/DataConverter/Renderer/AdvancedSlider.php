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
 * Render advanced slider to PageBuilder format
 */
class AdvancedSlider implements RendererInterface
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
            'data-role' => 'advanced-slider',
            'data-autoplay' => isset($eavData['autoplay']) ? $eavData['autoplay'] : '',
            'data-autoplay-speed' => isset($eavData['autoplay_speed']) ? $eavData['autoplay_speed'] : '',
            'data-fade' => isset($eavData['fade']) ? $eavData['fade'] : '',
            'data-is-infinite' => isset($eavData['is_infinite']) ? $eavData['is_infinite'] : '',
            'data-show-arrows' => isset($eavData['show_arrows']) ? $eavData['show_arrows'] : '',
            'data-show-dots' => isset($eavData['show_dots']) ? $eavData['show_dots'] : '',
            'data-advanced-settings' => isset($eavData['slider_advanced_settings'])
                ? $eavData['slider_advanced_settings'] : '',
            'class' => $itemData['formData']['css_classes'] ?? '',
        ];

        if (isset($itemData['formData'])) {
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $rootElementAttributes['style'] = $style;
            }
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue !== '' ? " $attributeName=\"$attributeValue\"" : '';
        }

        $rootElementHtml .= '>';

        if (isset($additionalData['children'])) {
            $rootElementHtml .=  $additionalData['children'];
        }

        $rootElementHtml .= '</div>';

        return $rootElementHtml;
    }
}
