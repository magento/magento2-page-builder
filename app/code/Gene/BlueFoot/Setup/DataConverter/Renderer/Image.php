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
 * Render image to PageBuilder format
 */
class Image implements RendererInterface
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
            'data-role' => 'image'
        ];

        if (isset($itemData['formData']['css_classes'])) {
            $rootElementAttributes['class'] = 'bluefoot-image bluefoot-entity ' . $itemData['formData']['css_classes'];
        } else {
            $rootElementAttributes['class'] = 'bluefoot-image bluefoot-entity';
        }

        $style = $this->styleExtractor->extractStyle($itemData['formData']);
        if ($style) {
            $rootElementAttributes['style'] = $style;
        }

        $rootElementHtml = '<figure';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '><a href="{{media url=wysiwyg/bluefoot' . $eavData['image'] . '}}"';
        if (isset($eavData['title_tag'])) {
            $rootElementHtml .= ' title="' . $eavData['title_tag'] . '"';
        }

        if (isset($eavData['has_lightbox']) && $eavData['has_lightbox'] == 1) {
            $rootElementHtml .= ' class="bluefoot-lightbox"';
        }

        $rootElementHtml .= '><img src="{{media url=wysiwyg/bluefoot' . $eavData['image'] . '}}"';

        if (isset($eavData['alt_tag'])) {
            $rootElementHtml .= ' alt="' . $eavData['alt_tag'] . '"';
        }

        if (isset($eavData['title_tag'])) {
            $rootElementHtml .= ' title="' . $eavData['title_tag'] . '"';
        }

        if (isset($eavData['mobile_image'])) {
            $rootElementHtml .= ' class="bluefoot-mobile-hidden"><img class="bluefoot-mobile-only"' .
                ' src="{{media url=wysiwyg/bluefoot' . $eavData['mobile_image'] . '}}"';
            if (isset($eavData['alt_tag'])) {
                $rootElementHtml .= ' alt="' . $eavData['alt_tag'] . '"';
            }

            if (isset($eavData['title_tag'])) {
                $rootElementHtml .= ' title="' . $eavData['title_tag'] . '">';
            }
        } else {
            $rootElementHtml .= '>';
        }
        $rootElementHtml .= '</a>';

        if (isset($eavData['show_caption']) && $eavData['show_caption'] == 1) {
            $rootElementHtml .= '<figcaption>' . $eavData['title_tag'] . '</figcaption>';
        }

        $rootElementHtml .= '</figure>';

        return $rootElementHtml;
    }
}
