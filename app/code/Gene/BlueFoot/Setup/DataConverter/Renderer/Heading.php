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
 * Render heading to PageBuilder format
 */
class Heading implements RendererInterface
{
    /**
     * @var StyleExtractorInterface
     */
    private $styleExtractor;

    /**
     * @var EntityHydratorInterface
     */
    private $entityHydrator;

    /**
     * @var \Gene\BlueFoot\Model\Attribute
     */
    private $headingEntityAttribute;

    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EntityHydratorInterface $entityHydrator,
        \Gene\BlueFoot\Model\Attribute $blueFootEntityAttribute
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->entityHydrator = $entityHydrator;
        $this->headingEntityAttribute = $blueFootEntityAttribute;
    }

    /**
     * {@inheritdoc}
     */
    public function render(array $itemData, array $additionalData = [])
    {
        $eavData = $this->entityHydrator->hydrate($itemData);

        // Replace integer heading value with label
        $this->headingEntityAttribute->loadByCode('gene_bluefoot_entity', 'heading_type');
        foreach ($this->headingEntityAttribute->getOptions() as $headingOption) {
            if ($headingOption->getValue() === $eavData['heading_type']) {
                $eavData['heading_type'] = $headingOption->getLabel();
                break;
            }
        }

        $rootElementAttributes = [
            'data-role' => 'heading',
            'class' => $eavData['css_classes'] ?? ''
        ];

        $style = $this->styleExtractor->extractStyle($itemData['formData']);
        if ($style) {
            $rootElementAttributes['style'] = $style;
        }

        $rootElementHtml = '<' . $eavData['heading_type'];
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '>' . $eavData['title'] . '</' . $eavData['heading_type'] . '>';

        return $rootElementHtml;
    }
}
