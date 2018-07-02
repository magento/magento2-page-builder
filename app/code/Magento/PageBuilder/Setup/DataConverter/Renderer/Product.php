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
use Magento\Framework\App\ResourceConnection;
use Magento\Catalog\Api\Data\ProductInterface;
use Magento\Framework\EntityManager\MetadataPool;
use Magento\PageBuilder\Setup\DataConverter\NoSuchEntityException;
use Magento\Widget\Helper\Conditions;
use Magento\Framework\Escaper;
use Magento\Framework\Serialize\Serializer\Json;

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

    /**
     * @var \Magento\Widget\Helper\Conditions
     */
    private $conditionsHelper;

    /**
     * @var Escaper
     */
    private $escaper;

    /**
     * @var Json
     */
    private $jsonEncoder;

    /**
     * Product constructor.
     * @param StyleExtractorInterface $styleExtractor
     * @param EavAttributeLoaderInterface $eavAttributeLoader
     * @param ResourceConnection $resourceConnection
     * @param MetadataPool $metadataPool
     * @param Conditions $conditionsHelper
     * @param Escaper $escaper
     */
    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader,
        ResourceConnection $resourceConnection,
        MetadataPool $metadataPool,
        Conditions $conditionsHelper,
        Escaper $escaper,
        Json $jsonEncoder
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
        $this->resourceConnection = $resourceConnection;
        $this->metadataPool = $metadataPool;
        $this->conditionsHelper = $conditionsHelper;
        $this->escaper = $escaper;
        $this->jsonEncoder = $jsonEncoder;
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

        if (!isset($eavData['product_id'])) {
            throw new NoSuchEntityException(__('product_id is missing.'));
        }
        $connection = $this->resourceConnection->getConnection();
        $productMetadata = $this->metadataPool->getMetadata(ProductInterface::class);
        $select = $connection->select()
            ->from($this->resourceConnection->getTableName('catalog_product_entity'), ['sku'])
            ->where($productMetadata->getIdentifierField() . ' = ?', (int) $eavData['product_id']);
        $productSku = $connection->fetchOne($select);
        if (!$productSku) {
            throw new NoSuchEntityException(__('Product with id %1 does not exist.', $eavData['product_id']));
        }

        $conditions = [
            '1' => [
                'type' => \Magento\CatalogWidget\Model\Rule\Condition\Combine::class,
                'aggregator' => 'all',
                'value' => '1',
                'new_child' => [
                    '1--1' => [
                        'type' => \Magento\CatalogWidget\Model\Rule\Condition\Product::class,
                        'attribute' => 'sku',
                        'operator' => '==',
                        'value' => $productSku,
                    ]

                ],
            ],
        ];

        $productsCount = $eavData['product_display'] ?? 5;
        $conditionsEncoded = $this->conditionsHelper->encode($conditions);
        $widgetString = "{{widget type=\"Magento\CatalogWidget\Block\Product\ProductsList\" " .
            "template=\"Magento_CatalogWidget::product/widget/content/grid.phtml\" " .
            "type_name=\"Catalog Products List\" anchor_text=\"\" id_path=\"\" show_pager=\"0\" " .
            "products_count=\"$productsCount\" conditions_encoded=\"$conditionsEncoded\"}}";

        $rootElementAttributes = [
            'data-role' => 'product',
            'data-appearance' => 'grid',
            'class' => $eavData['css_classes'] ?? '',
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
        $rootElementHtml .= ">$widgetString</div>";

        return $rootElementHtml;
    }
}
