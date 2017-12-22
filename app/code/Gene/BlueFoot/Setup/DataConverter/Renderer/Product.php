<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\Renderer;

use Gene\BlueFoot\Setup\DataConverter\RendererInterface;
use Gene\BlueFoot\Setup\DataConverter\EavAttributeLoaderInterface;
use Gene\BlueFoot\Setup\DataConverter\StyleExtractorInterface;
use Magento\Framework\App\ResourceConnection;
use Magento\Catalog\Api\Data\ProductInterface;
use Magento\Framework\EntityManager\MetadataPool;
use Gene\BlueFoot\Setup\DataConverter\NoSuchEntityException;

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
     * @var ResourceConnection
     */
    private $resourceConnection;

    /**
     * @var MetadataPool
     */
    private $metadataPool;

    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader,
        ResourceConnection $resourceConnection,
        MetadataPool $metadataPool
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
        $this->resourceConnection = $resourceConnection;
        $this->metadataPool = $metadataPool;
    }

    /**
     * {@inheritdoc}
     * @throws NoSuchEntityException
     */
    public function render(array $itemData, array $additionalData = [])
    {
        $eavData = $this->eavAttributeLoader->load($itemData);

        if (!isset($eavData['product_id'])) {
            throw new NoSuchEntityException('product_id is missing.');
        }
        $connection = $this->resourceConnection->getConnection();
        $productMetadata = $this->metadataPool->getMetadata(ProductInterface::class);
        $select = $connection->select()
            ->from('catalog_product_entity', ['sku'])
            ->where($productMetadata->getIdentifierField() . ' = ?', (int) $eavData['product_id']);
        $productSku = $connection->fetchOne($select);
        if (!$productSku) {
            throw new NoSuchEntityException('Product with id ' . $eavData['product_id'] . 'does not exist.');
        }

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
