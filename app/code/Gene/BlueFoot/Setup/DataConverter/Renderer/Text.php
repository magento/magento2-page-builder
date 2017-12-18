<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\Renderer;

use Gene\BlueFoot\Setup\DataConverter\RendererInterface;
use Gene\BlueFoot\Setup\DataConverter\EntityHydratorInterface;
use Gene\BlueFoot\Setup\DataConverter\StyleExtractorInterface;

/**
 * Render text to PageBuilder format
 */
class Text implements RendererInterface
{
    /**
     * @var StyleExtractorInterface
     */
    private $styleExtractor;

    /**
     * @var EntityHydratorInterface
     */
    private $entityHydrator;

    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EntityHydratorInterface $entityHydrator
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->entityHydrator = $entityHydrator;
    }

    /**
     * {@inheritdoc}
     */
    public function render(array $itemData, array $additionalData = [])
    {
        $eavData = $this->entityHydrator->hydrate($itemData);

        $rootElementAttributes = [
            'data-role' => 'text',
            'class' => $itemData['formData']['css_classes'] ?? '',
            'style' => ''
        ];

        $style = $this->styleExtractor->extractStyle($itemData['formData']);
        if ($style) {
            $rootElementAttributes['style'] = $style;
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '>' . $eavData['textarea'] . '</div>';

        return $rootElementHtml;
    }
}
