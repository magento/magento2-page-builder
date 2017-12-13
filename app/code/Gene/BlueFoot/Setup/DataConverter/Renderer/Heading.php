<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\Renderer;

use Gene\BlueFoot\Setup\DataConverter\RendererInterface;
use Gene\BlueFoot\Setup\DataConverter\EntityHydratorInterface;

class Heading implements RendererInterface
{
    /**
     * @var EntityHydratorInterface
     */
    private $entityHydrator;

    public function __construct(EntityHydratorInterface $entityHydrator)
    {
        $this->entityHydrator = $entityHydrator;
    }

    /**
     * {@inheritdoc}
     */
    public function render($itemData, $additionalData = [])
    {
        $eavData = $this->entityHydrator->hydrate($itemData);
        $rootElementAttributes = [
            'data-role' => 'heading',
            'class' => $eavData['css_classes'] ?? ''
        ];

        $rootElementHtml = '<' . $eavData['heading_type'];
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= " $attributeName=\"$attributeValue\"";
        }
        $rootElementHtml .= '>' . $eavData['title'] . '</' . $eavData['heading_type'] . '>';

        return $rootElementHtml;
    }
}
