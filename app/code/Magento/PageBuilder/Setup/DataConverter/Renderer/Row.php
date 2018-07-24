<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Setup\DataConverter\Renderer;

use Magento\PageBuilder\Setup\DataConverter\RendererInterface;
use Magento\PageBuilder\Setup\DataConverter\StyleExtractorInterface;

/**
 * Render row to PageBuilder format
 */
class Row implements RendererInterface
{
    /**
     * @var StyleExtractorInterface
     */
    private $styleExtractor;

    public function __construct(StyleExtractorInterface $styleExtractor)
    {
        $this->styleExtractor = $styleExtractor;
    }

    /**
     * {@inheritdoc}
     *
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    public function render(array $itemData, array $additionalData = []) : string
    {
        $formData = $itemData['formData'] ?? [];
        $appearance = (isset($formData['template'])
            && $formData['template'] === 'full-width.phtml') ? 'full-width' : 'contained';

        // Handle adding the wrapper element attributes when using the contained appearance
        $rootElementAttributes = [];
        if ($appearance === 'contained') {
            $wrapperElementAttributes = [
                'data-element' => 'wrapper',
                'data-role' => 'row',
                'data-appearance' => 'contained',
                'class' => 'row-contained',
            ];
            $rootElementAttributes = [
                'data-element' => 'main',
                'class' => $itemData['formData']['css_classes'] ?? '',
            ];
        } elseif ($appearance === 'full-width') {
            $rootElementAttributes = [
                'data-element' => 'main',
                'data-role' => 'row',
                'data-appearance' => 'full-width',
                'class' => $itemData['formData']['css_classes'] ?? '',
            ];
        }

        $style = $this->styleExtractor->extractStyle($formData);
        if ($style) {
            $rootElementAttributes['style'] = $style;
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $attributeValue = trim($attributeValue);
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '>' . (isset($additionalData['children']) ? $additionalData['children'] : '') . '</div>';

        // Wrap the root element in our wrapper for contained appearances
        if ($appearance === 'contained' && isset($wrapperElementAttributes)) {
            $wrapperElementHtml = '<div';
            foreach ($wrapperElementAttributes as $attributeName => $attributeValue) {
                $attributeValue = trim($attributeValue);
                $wrapperElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
            }
            $wrapperElementHtml .= '>' . $rootElementHtml . '</div>';
            return $wrapperElementHtml;
        }

        return $rootElementHtml;
    }
}
