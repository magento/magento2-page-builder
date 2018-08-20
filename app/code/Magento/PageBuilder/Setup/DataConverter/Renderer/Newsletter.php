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
 * Render newsletter to PageBuilder format
 */
class Newsletter implements RendererInterface
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

        $newsletterClasses = $eavData['css_classes'] ?? '';
        $newsletterButtonText = $eavData['button_text'] ?? '';
        $newsletterLabel = $eavData['label'] ?? '';
        $newsletterTitle = $eavData['title'] ?? '';
        $newsletterPlaceHolder = $eavData['placeholder'] ?? '';

        $newsletterStyles = '';
        if (isset($itemData['formData'])) {
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $newsletterStyles = $style;
            }
        }

        $newsletterHtml = "{{block class=\"Magento\Newsletter\Block\Subscribe\" " .
            "template=\"Magento_PageBuilder::content_type/newsletter.phtml\" " .
            "placeholder=\"$newsletterPlaceHolder\" " .
            "classes=\"$newsletterClasses\" " .
            "styles=\"$newsletterStyles\" " .
            "button_text=\"$newsletterButtonText\" " .
            "label_text=\"$newsletterLabel\" " .
            "title=\"$newsletterTitle\"}}";

        $rootElementHtml = '<div data-element="main" data-role="html" data-appearance="default">';
        $rootElementHtml .= $newsletterHtml . '</div>';


        return $rootElementHtml;
    }
}
