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
 * Render tabs to PageBuilder format
 */
class Tabs implements RendererInterface
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
     * @var EavAttributeLoaderInterface
     */
    private $tabItemEavAttributeLoader;

    /**
     * @param StyleExtractorInterface $styleExtractor
     * @param EavAttributeLoaderInterface $eavAttributeLoader
     * @param EavAttributeLoaderInterface $tabItemEavAttributeLoader
     */
    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader,
        EavAttributeLoaderInterface $tabItemEavAttributeLoader
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
        $this->tabItemEavAttributeLoader = $tabItemEavAttributeLoader;
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

        $rootElementAttributes = [
            'data-element' => 'main',
            'data-content-type' => 'tabs',
            'data-appearance' => 'default',
            'class' => $eavData['css_classes'] ?? ''
        ];

        if (isset($itemData['formData'])) {
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $rootElementAttributes['style'] = $style;
            }
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '><ul data-element="navigation" role="tablist" class="tabs-navigation">';
        if (isset($itemData['children']['tabs_items']) && count($itemData['children']['tabs_items']) > 0) {
            $rootElementHtml .= $this->renderTabHeaders(
                $additionalData['childIndex'],
                $itemData['children']['tabs_items']
            );
        }
        $rootElementHtml .= '</ul><div data-element="content" class="tabs-content">'
            . (isset($additionalData['children']) ? $additionalData['children'] : '')
            . '</div></div>';
        return $rootElementHtml;
    }

    /**
     * Render the tab headers
     *
     * @param int $childIndex
     * @param array $tabItems
     * @return string
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    private function renderTabHeaders(int $childIndex, array $tabItems): string
    {
        $tabHeaderElementHtml = '';
        foreach ($tabItems as $tabIndex => $tabItem) {
            $tabItemEavData = $this->tabItemEavAttributeLoader->load($tabItem['entityId']);
            $tabId = 'tab' . $childIndex . '-' . $tabIndex;
            $tabHeaderElementHtml .= '<li data-element="headers" role="tab" class="tab-header">'
                . '<a href="#' . $tabId . '" class="tab-title" title="' . $tabItemEavData['title'] . '">'
                . '<span class="tab-title">' . $tabItemEavData['title'] . '</span>'
                . '</a>'
                . '</li>';
        }
        return $tabHeaderElementHtml;
    }
}
