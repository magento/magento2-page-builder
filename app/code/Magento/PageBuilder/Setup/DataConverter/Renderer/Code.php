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
 * Render code to PageBuilder format
 */
class Code implements RendererInterface
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

        $preElementAttributes = [
            'class' => $eavData['css_classes'] ?? '',
        ];
        if (isset($itemData['formData'])) {
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $preElementAttributes['style'] = $style;
            }
        }

        $rootElementHtml = '<div data-element="main" data-role="html" data-appearance="default"><pre';
        foreach ($preElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '><code>' . ($eavData['html'] ?? '') . '</code></pre></div>';

        return $rootElementHtml;
    }
}
