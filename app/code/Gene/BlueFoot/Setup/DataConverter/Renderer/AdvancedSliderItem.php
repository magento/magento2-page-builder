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
 * Render advanced slider item to PageBuilder format
 */
class AdvancedSliderItem implements RendererInterface
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
            'data-role' => 'slide',
            'class' => ($eavData['css_classes'] ?? '') . ' pagebuilder-slider',
        ];

        $formData = $itemData['formData'];
        $formData['background_image'] = isset($eavData['background_image']) ? $eavData['background_image'] : '';

        $style = $this->styleExtractor->extractStyle($formData);
        if ($style) {
            $rootElementAttributes['style'] = $style;
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue !== '' ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '><div style="text-align: '
            . $formData['align']
            . ';"><div';
        if ($eavData['has_overlay']) {
            $rootElementHtml .= ' class="has-background-overlay"';
        }
        $rootElementHtml .= ' style="text-align: '
            . $formData['align']
            . ';" class="pagebuilder-content"><h3>'
            . $eavData['title']
            . '</h3><div class="slider-content">'
            . $eavData['textarea']
            . '</div>';
        if (isset($eavData['link_text'])) {
            $rootElementHtml .= '<a class="button" href="'
                . $eavData['link_url']
                . '"><span><span>'
                . $eavData['link_text']
                . '</span></span></a>';
        }
        $rootElementHtml .= '</div></div></div>';
        return $rootElementHtml;
    }
}
