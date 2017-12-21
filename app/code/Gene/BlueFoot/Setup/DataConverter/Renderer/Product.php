<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\Renderer;

use Gene\BlueFoot\Setup\DataConverter\RendererInterface;
use Gene\BlueFoot\Setup\DataConverter\EavAttributeLoaderInterface;
use Gene\BlueFoot\Setup\DataConverter\StyleExtractorInterface;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Framework\Exception\NoSuchEntityException;

/**
 * Render product to PageBuilder format
 */
class Product implements RendererInterface
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
     * @var ProductRepositoryInterface
     */
    private $productRepository;

    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader,
        ProductRepositoryInterface $productRepository
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
        $this->productRepository = $productRepository;
    }

    /**
     * {@inheritdoc}
     * @throws NoSuchEntityException
     */
    public function render(array $itemData, array $additionalData = [])
    {
        $eavData = $this->eavAttributeLoader->load($itemData);

        $productSku = $this->productRepository->getById($eavData['product_id'])->getSku();

        $rootElementAttributes = [
            'data-role' => 'products',
            'class' => $eavData['css_classes'] ?? '',
            'data-view-mode' => $eavData['product_display'] ?? '',
            'data-sku' => $productSku
        ];

        if (isset($itemData['formData'])) {
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $rootElementAttributes['style'] = $style;
            }
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue !== '' ? " $attributeName=\"$attributeValue\"" : '';
        }
        $rootElementHtml .= '></div>';

        return $rootElementHtml;
    }
}
