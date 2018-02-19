<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter\Renderer;

use Magento\PageBuilder\Setup\DataConverter\RendererInterface;
use Magento\PageBuilder\Setup\DataConverter\EavAttributeLoaderInterface;
use Magento\PageBuilder\Setup\DataConverter\StyleExtractorInterface;
use Magento\Framework\Serialize\Serializer\Json;

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

    /**
     * @var Json
     */
    private $serializer;

    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader,
        Json $serializer
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
        $this->serializer = $serializer;
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
            'data-role' => 'banner',
            'data-appearance' => 'poster',
            'data-show-button' => 'never_show',
            'data-show-overlay' => 'never_show',
            'class' => $eavData['css_classes'] ?? ''
        ];

        $margin = ' margin: 0px;';
        $padding = ' padding: 40px;';
        $textAlign = '';
        $rootElementAttributes['style'] = 'background-size: auto; background-repeat: no-repeat; '
            . 'background-attachment: scroll; border: 1px none; border-radius: 0px;';
        if (isset($itemData['formData'])) {
            $formData = $itemData['formData'];
            if (isset($formData['metric']) && $itemData['formData']['metric'] !== '') {
                $metric = $this->serializer->unserialize($formData['metric']);
                if (isset($metric['margin'])) {
                    $margin = ' margin: ' . str_replace('-', '0px', $metric['margin']) . ';';
                    unset($metric['margin']);
                }
                if (isset($metric['padding'])) {
                    $padding = ' padding: ' . str_replace('-', '0px', $metric['padding']) . ';';
                    unset($metric['padding']);
                }
                $formData['metric'] = $this->serializer->serialize($metric);
            }
            if (isset($formData['align']) && $formData['align'] !== '') {
                $textAlign = ' text-align: ' . $formData['align'] . ';';
                unset($formData['align']);
            }
            $style = $this->styleExtractor->extractStyle($formData);
            if ($style) {
                $rootElementAttributes['style'] .= ' ' . $style;
            }
        }
        $rootElementAttributes['style'] .= $margin;

        $rootElementHtml = '<div' . $this->printAttributes($rootElementAttributes);

        $linkAttributes = [
            'href' => $eavData['link_url'] ?? '',
            'target' => isset($eavData['target_blank']) && $eavData['target_blank'] ? '_blank' : '',
        ];

        $imageAttributes = [
            'style' => 'background-image: url('
                . '{{media url=gene-cms'
                . $eavData['image']
                . '}}); '
                . 'min-height: 300px; background-size: auto; background-repeat: no-repeat; '
                . 'background-attachment: scroll;'
                . $textAlign,
            'class' => 'pagebuilder-banner-wrapper pagebuilder-banner-image pagebuilder-mobile-hidden'
        ];

        $mobileImageAttributes = [
            'style' => 'background-image: url('
                . '{{media url=gene-cms'
                . (isset($eavData['image']) ? $eavData['image'] : $eavData['mobile_image'])
                . '}}); '
                . 'min-height: 300px; background-size: auto; background-repeat: no-repeat; '
                . 'background-attachment: scroll;'
                . $textAlign
        ];

        $mobileImageElementHtml = '<div'
            . $this->printAttributes($mobileImageAttributes)
            . ' class="pagebuilder-banner-wrapper pagebuilder-banner-mobile pagebuilder-mobile-only">';

        $imageElementHtml = '<div' . $this->printAttributes($imageAttributes) . '>';

        $overlayElementHtml = '<div class="pagebuilder-poster-overlay" data-overlay-color="transparent" ' .
            'style="background-color: transparent; min-height: 300px;' . $padding . '">';

        $rootElementHtml .= '><a'
            . $this->printAttributes($linkAttributes)
            . '>'
            . $imageElementHtml
            . $overlayElementHtml
            . '<div class="pagebuilder-poster-content"><div></div></div></div></div>'
            . $mobileImageElementHtml
            . $overlayElementHtml
            . '<div class="pagebuilder-poster-content"><div></div></div></div></div></a></div>';

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
