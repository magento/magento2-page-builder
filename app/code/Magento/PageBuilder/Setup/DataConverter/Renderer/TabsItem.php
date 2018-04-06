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
use Magento\PageBuilder\Setup\DataConverter\StaticEavAttributeLoaderFactory;

/**
 * Render tab item to PageBuilder format
 */
class TabsItem implements RendererInterface
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
     * @var StaticEavAttributeLoaderFactory
     */
    private $staticEavAttributeLoaderFactory;

    /**
     * @var \Magento\PageBuilder\Setup\DataConverter\Renderer\TextareaFactory
     */
    private $textareaFactory;

    /**
     * TabsItem constructor.
     * @param StyleExtractorInterface $styleExtractor
     * @param EavAttributeLoaderInterface $eavAttributeLoader
     * @param StaticEavAttributeLoaderFactory $staticEavAttributeLoaderFactory
     * @param \Magento\PageBuilder\Setup\DataConverter\Renderer\TextareaFactory $textareaFactory
     */
    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader,
        StaticEavAttributeLoaderFactory $staticEavAttributeLoaderFactory,
        TextareaFactory $textareaFactory
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
        $this->staticEavAttributeLoaderFactory = $staticEavAttributeLoaderFactory;
        $this->textareaFactory = $textareaFactory;
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

        $cssClasses = $eavData['css_classes'] ?? '';

        $rootElementAttributes = [
            'data-role' => 'tab',
            'class' => $cssClasses,
            'data-tab-name' => $eavData['title'],
            'id' => 'tab' . $additionalData['parentChildIndex'] . '_' . $additionalData['childIndex']
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
        $rootElementHtml .= '>' . $this->renderTextarea($eavData['textarea']) . '</div>';

        return $rootElementHtml;
    }

    /**
     * Render the text area content type's renderer
     *
     * @param $content
     * @return string
     */
    private function renderTextarea($content)
    {
        $textareaRenderer = $this->textareaFactory->create([
            // Use a static EAV attribute loader so we can define the values
            'eavAttributeLoader' => $this->staticEavAttributeLoaderFactory->create([
                'eavData' => [
                    1 => [
                        'textarea' => $content
                    ]
                ]
            ]),
        ]);

        return $textareaRenderer->render([
            'entityId' => 1
        ]);
    }
}
