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

        $cssClasses = $eavData['css_classes'] ?? '';

        $rootElementAttributes = [
            'data-element' => 'main',
            'data-content-type' => 'button-item',
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
        $linkDataElementName = isset($eavData['link_url']) ? 'link' : 'empty_link';

        $rootElementHtml .= '><' . $linkNodeName . ' data-element="' . $linkDataElementName . '"'
            . (isset($eavData['link_url']) ? ' href="' . $eavData['link_url'] . '"' : '')
            . $buttonStyleAttribute
            . ' class="pagebuilder-button-primary"><span data-element="link_text">'
            . ($eavData['link_text'] ?? '')
            . '</span></' . $linkNodeName . '></div>';

        return $rootElementHtml;
    }
}
