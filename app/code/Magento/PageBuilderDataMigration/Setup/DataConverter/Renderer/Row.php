<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Setup\DataConverter\Renderer;

use Magento\PageBuilderDataMigration\Setup\DataConverter\RendererInterface;
use Magento\PageBuilderDataMigration\Setup\DataConverter\StyleExtractorInterface;

/**
 * Render row to PageBuilder format
 */
class Row implements RendererInterface
{
    /**
     * @var StyleExtractorInterface
     */
    private $styleExtractor;

    /**
     * @param StyleExtractorInterface $styleExtractor
     */
    public function __construct(StyleExtractorInterface $styleExtractor)
    {
        $this->styleExtractor = $styleExtractor;
    }

    /**
     * @inheritdoc
     */
    public function render(array $itemData, array $additionalData = []) : string
    {
        $formData = $itemData['formData'] ?? [];

        $style = $this->styleExtractor->extractStyle($formData);

        $childrenHtml = (isset($additionalData['children']) ? $additionalData['children'] : '');

        // Return an altered appearance for full width
        if (isset($formData['template']) && $formData['template'] === 'full-width.phtml') {
            return $this->renderElementWithAttributes(
                [
                    'data-element' => 'main',
                    'data-content-type' => 'row',
                    'data-appearance' => 'full-width',
                    'class' => $itemData['formData']['css_classes'] ?? '',
                    'style' => $style ?? null
                ],
                $this->renderElementWithAttributes(
                    [
                        'data-element' => 'inner',
                        'class' => 'row-full-width-inner',
                    ],
                    $childrenHtml
                )
            );
        }

        // All other rows default to our new default of contained
        return $this->renderElementWithAttributes(
            [
                'data-element' => 'main',
                'data-content-type' => 'row',
                'data-appearance' => 'contained',
            ],
            $this->renderElementWithAttributes(
                [
                    'data-element' => 'inner',
                    'class' => $itemData['formData']['css_classes'] ?? '',
                    'style' => $style ?? null
                ],
                $childrenHtml
            )
        );
    }

    /**
     * Render an element with an attributes array
     *
     * @param array $attributes
     * @param string $childrenHtml
     * @return string
     */
    private function renderElementWithAttributes(array $attributes, string $childrenHtml = '') : string
    {
        $rootElementHtml = '<div';
        foreach ($attributes as $attributeName => $attributeValue) {
            $attributeValue = trim($attributeValue);
            if ($attributeValue) {
                $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
            }
        }
        $rootElementHtml .= '>' . $childrenHtml . '</div>';
        return $rootElementHtml;
    }
}
