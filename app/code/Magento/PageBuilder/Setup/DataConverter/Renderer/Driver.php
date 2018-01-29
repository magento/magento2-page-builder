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
 * Render driver to PageBuilder format
 */
class Driver implements RendererInterface
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
            'data-role' => 'driver',
            'class' => $eavData['css_classes'] ?? ''
        ];

        if (isset($itemData['formData'])) {
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $rootElementAttributes['style'] = $style;
            }
        }

        $rootElementHtml = '<div'
            . $this->printAttributes($rootElementAttributes);

        $linkAttributes = [
            'href' => $eavData['link_url'] ?? '',
            'title' => $eavData['title_tag'] ?? '',
            'target' => isset($eavData['target_blank']) && $eavData['target_blank'] ? '_blank' : '',
        ];

        $imageAttributes = [
            'src' => '{{media url=gene-cms' . $eavData['image'] . '}}',
            'alt' => $eavData['alt_tag'] ?? '',
            'title' => $eavData['title_tag'] ?? ''
        ];

        $mobileImageHtml = '';
        if (isset($eavData['mobile_image'])) {
            $mobileImageAttributes = [
                'src' => '{{media url=gene-cms' . $eavData['mobile_image'] . '}}',
                'alt' => $eavData['alt_tag'] ?? '',
                'title' => $eavData['title_tag'] ?? ''
            ];
            $imageAttributes['class'] = 'pagebuilder-mobile-hidden';

            $mobileImageHtml = '<img'
                . $this->printAttributes($mobileImageAttributes)
                . ' class="pagebuilder-mobile-only">';
        }

        $imageHtml = '<img'
            . $this->printAttributes($imageAttributes)
            . '>';

        $descriptionHtml = '';
        if (isset($eavData['link_text'])) {
            $descriptionHtml = '<div>'
                . $eavData['link_text']
                . '</div>';
        }

        $rootElementHtml .= '><a'
            . $this->printAttributes($linkAttributes)
            . '>'
            . $imageHtml
            . $mobileImageHtml
            . $descriptionHtml
            . '</a></div>';

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
