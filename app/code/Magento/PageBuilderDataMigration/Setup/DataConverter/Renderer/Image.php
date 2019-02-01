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
 * Render image to PageBuilder format
 */
class Image implements RendererInterface
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

        $rootElementAttributes = [
            'data-element' => 'main',
            'data-appearance' => 'full-width',
            'data-role' => 'image',
            'class' => $eavData['css_classes'] ?? ''
        ];

        if (isset($itemData['formData'])) {
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $rootElementAttributes['style'] = $style;
            }
        }

        $rootElementHtml = '<figure' . $this->printAttributes($rootElementAttributes);

        $linkAttributes = [
            'data-element' => 'link',
            'href' => '{{media url=wysiwyg' . $eavData['image'] . '}}',
            'title' => $eavData['title_tag'] ?? ''
        ];

        $imageAttributes = [
            'data-element' => 'desktop_image',
            'src' => '{{media url=wysiwyg' . $eavData['image'] . '}}',
            'alt' => $eavData['alt_tag'] ?? '',
            'title' => $eavData['title_tag'] ?? '',
            'style' => 'max-width: 100%; height: auto;'
        ];

        $mobileImageHtml = '';
        if (isset($eavData['mobile_image'])) {
            $mobileImageAttributes = [
                'data-element' => 'mobile_image',
                'src' => '{{media url=wysiwyg' . $eavData['mobile_image'] . '}}',
                'alt' => $eavData['alt_tag'] ?? '',
                'title' => $eavData['title_tag'] ?? '',
                'style' => 'max-width: 100%; height: auto;'
            ];
            $imageAttributes['class'] = 'pagebuilder-mobile-hidden';

            $mobileImageHtml = '<img'
                . $this->printAttributes($mobileImageAttributes)
                . ' class="pagebuilder-mobile-only">';
        }

        $imageHtml = '<img'
            . $this->printAttributes($imageAttributes)
            . '>';

        $captionHtml = '';
        if (isset($eavData['show_caption']) && $eavData['show_caption'] == 1) {
            $captionHtml .= '<figcaption data-element="caption">' . $eavData['title_tag'] . '</figcaption>';
        }

        $rootElementHtml .= '><a'
            . $this->printAttributes($linkAttributes)
            . '>'
            . $imageHtml
            . $mobileImageHtml
            . '</a>'
            . $captionHtml
            . '</figure>';

        return $rootElementHtml;
    }

    /**
     * Print HTML attributes
     *
     * @param array $elementAttributes
     * @return string
     */
    private function printAttributes($elementAttributes): string
    {
        $elementAttributesHtml = '';
        foreach ($elementAttributes as $attributeName => $attributeValue) {
            $elementAttributesHtml .= $attributeValue !== '' ? " $attributeName=\"$attributeValue\"" : '';
        }
        return $elementAttributesHtml;
    }
}
