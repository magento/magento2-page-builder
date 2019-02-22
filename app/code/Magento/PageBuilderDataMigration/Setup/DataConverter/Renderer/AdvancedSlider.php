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
     *
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    public function render(array $itemData, array $additionalData = []) : string
    {
        if (!isset($itemData['entityId'])) {
            throw new \InvalidArgumentException('entityId is missing.');
        }
        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);

        $cssClasses = $eavData['css_classes'] ?? '';
        $cssClasses .= isset($eavData['css_classes']) ? ' pagebuilder-slider' : 'pagebuilder-slider';

        $rootElementAttributes = [
            'data-element' => 'main',
            'data-content-type' => 'slider',
            'data-appearance' => 'default',
            'data-autoplay' => isset($eavData['autoplay']) ? $eavData['autoplay'] : '',
            'data-autoplay-speed' => isset($eavData['autoplay_speed']) ? $eavData['autoplay_speed'] : '',
            'data-fade' => isset($eavData['fade']) ? $eavData['fade'] : '',
            'data-is-infinite' => isset($eavData['is_infinite']) ? $eavData['is_infinite'] : '',
            'data-show-arrows' => isset($eavData['show_arrows']) ? $eavData['show_arrows'] : '',
            'data-show-dots' => isset($eavData['show_dots']) ? $eavData['show_dots'] : '',
            'class' => $cssClasses,
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
