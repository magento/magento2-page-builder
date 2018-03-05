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
 * Render search to PageBuilder format
 */
class Search implements RendererInterface
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
     * @var \Magento\Framework\Math\Random
     */
    private $mathRandom;

    /**
     * @var \Magento\Search\Helper\Data
     */
    private $searchHelper;

    /**
     * @var \Magento\Cms\Block\Block
     */
    private $block;

    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader,
        \Magento\Framework\Math\Random $mathRandom,
        \Magento\Search\Helper\Data $searchHelper,
        \Magento\Cms\Block\Block $block
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
        $this->mathRandom = $mathRandom;
        $this->searchHelper = $searchHelper;
        $this->block = $block;
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

        // Search content it migrated as HTML content block
        $rootElementAttributes = [
            'data-role' => 'html',
        ];

        $searchStyle = '';
        if (isset($itemData['formData'])) {
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $searchStyle = $style;
            }
        }

        $uniqueIdentifier = $this->mathRandom::getRandomNumber();
        $searchClasses = $eavData['css_classes'] ?? '';
        $searchPlaceHolder = $eavData['placeholder'] ?? '';

        $searchHtml = <<<SEARCH
<form id="search_mini_form_$uniqueIdentifier" 
class="pagebuilder-search-form pagebuilder-full-width $searchClasses" 
style="$searchStyle" 
action="{$this->searchHelper->getResultUrl()}" 
method="get">
<div class="form-search">
<label for="search_$uniqueIdentifier">{$this->block->escapeHtml(__('Search:'))}</label>
<input id="search_$uniqueIdentifier" type="search" 
name="{$this->block->escapeHtml($this->searchHelper->getQueryParamName())}" 
value="{$this->block->escapeHtml($this->searchHelper->getEscapedQueryText())}" class="input-text" 
maxlength="{$this->block->escapeHtml($this->searchHelper->getMaxQueryLength())}" 
placeholder="{$this->block->escapeHtml($searchPlaceHolder)}"/>
<button type="submit" title="{$this->block->escapeHtmlAttr(__('Search'))}" class="button search-button"></button>
<div id="search_autocomplete_$uniqueIdentifier" class="search-autocomplete"></div>
</div>
</form>
SEARCH;

        $searchHtml = str_replace(PHP_EOL,'', $searchHtml);
        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }

        $rootElementHtml .= '>' . $searchHtml . '</div>';

        return $rootElementHtml;
    }
}
