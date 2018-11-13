<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Setup\DataConverter\Renderer;

use Magento\PageBuilder\Setup\DataConverter\RendererInterface;
use Magento\PageBuilder\Setup\DataConverter\EavAttributeLoaderInterface;
use Magento\PageBuilder\Setup\DataConverter\StyleExtractorInterface;

/**
 * Render button item to PageBuilder format
 */
class ButtonItem implements RendererInterface
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
    public function render(array $itemData, array $additionalData = []) : string
    {
        if (!isset($itemData['entityId'])) {
            throw new \InvalidArgumentException('entityId is missing.');
        }
        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);

        $cssClasses = $eavData['css_classes'] ?? '';

        $rootElementAttributes = [
            'data-element' => 'main',
            'data-role' => 'button-item',
            'data-appearance' => 'default',
            'style' => 'display: inline-block;',
            'class' => $cssClasses
        ];

        $buttonStyleAttribute = '';
        if (isset($itemData['formData'])) {
            $styleAttributeValue = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($styleAttributeValue) {
                $buttonStyleAttribute = ' style="' . $styleAttributeValue . '"';
            }
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }

        $linkNodeName = isset($eavData['link_url']) ? 'a' : 'div';

        $rootElementHtml .= '><' . $linkNodeName . ' data-element="link" href="'
            . ($eavData['link_url'] ?? '') . '"'
            . $buttonStyleAttribute
            . ' class="pagebuilder-button-primary"><span data-element="link_text">'
            . ($eavData['link_text'] ?? '')
            . '</span></' . $linkNodeName . '></div>';

        return $rootElementHtml;
    }
}
