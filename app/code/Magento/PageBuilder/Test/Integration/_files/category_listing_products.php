<?php
/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\CategoryFactory;
use Magento\Catalog\Model\Product\Attribute\Source\Status;
use Magento\Catalog\Model\Product\Type;
use Magento\Catalog\Model\Product\Visibility;
use Magento\Catalog\Model\ProductFactory;
use Magento\Framework\Indexer\IndexerRegistry;
use Magento\TestFramework\Helper\Bootstrap;

$objectManager = Bootstrap::getObjectManager();
$categoryFactory = $objectManager->get(CategoryFactory::class);
$productFactory = $objectManager->get(ProductFactory::class);
$productRepository = $objectManager->get(ProductRepositoryInterface::class);

$category = $categoryFactory->create();
$category->setName('Page Builder Category Listing')
    ->setUrlKey('pb-category-listing')
    ->setParentId(2)
    ->setPath('1/2')
    ->setAvailableSortBy(['position', 'name', 'price'])
    ->setDefaultSortBy('position')
    ->setIsActive(true)
    ->setIsAnchor(true)
    ->setPosition(1)
    ->save();

$definitions = [
    [
        'sku' => 'pcl_zebra',
        'name' => 'PCL Zebra',
        'position' => 10,
        'status' => Status::STATUS_ENABLED,
        'visibility' => Visibility::VISIBILITY_BOTH,
        'in_stock' => 1,
    ],
    [
        'sku' => 'pcl_alpha',
        'name' => 'PCL Alpha',
        'position' => 20,
        'status' => Status::STATUS_ENABLED,
        'visibility' => Visibility::VISIBILITY_BOTH,
        'in_stock' => 1,
    ],
    [
        'sku' => 'pcl_yankee',
        'name' => 'PCL Yankee',
        'position' => 5,
        'status' => Status::STATUS_ENABLED,
        'visibility' => Visibility::VISIBILITY_BOTH,
        'in_stock' => 1,
    ],
    [
        'sku' => 'pcl_disabled',
        'name' => 'PCL Disabled',
        'position' => 1,
        'status' => Status::STATUS_DISABLED,
        'visibility' => Visibility::VISIBILITY_BOTH,
        'in_stock' => 1,
    ],
    [
        'sku' => 'pcl_out_of_stock',
        'name' => 'PCL Out Of Stock',
        'position' => 2,
        'status' => Status::STATUS_ENABLED,
        'visibility' => Visibility::VISIBILITY_BOTH,
        'in_stock' => 0,
    ],
    [
        'sku' => 'pcl_not_visible',
        'name' => 'PCL Not Visible',
        'position' => 3,
        'status' => Status::STATUS_ENABLED,
        'visibility' => Visibility::VISIBILITY_NOT_VISIBLE,
        'in_stock' => 1,
    ],
];

$positions = [];
foreach ($definitions as $definition) {
    $product = $productFactory->create();
    $product->setTypeId(Type::TYPE_SIMPLE)
        ->setAttributeSetId($product->getDefaultAttributeSetId())
        ->setWebsiteIds([1])
        ->setName($definition['name'])
        ->setSku($definition['sku'])
        ->setPrice(10)
        ->setVisibility($definition['visibility'])
        ->setStatus($definition['status'])
        ->setCategoryIds([(int)$category->getId()])
        ->setStockData([
            'use_config_manage_stock' => 1,
            'qty' => $definition['in_stock'] ? 100 : 0,
            'is_qty_decimal' => 0,
            'is_in_stock' => $definition['in_stock'],
        ]);
    $product = $productRepository->save($product);
    $positions[$product->getId()] = $definition['position'];
}

$category = $categoryFactory->create()->load((int)$category->getId());
$category->setPostedProducts($positions);
$category->save();

$indexerRegistry = $objectManager->get(IndexerRegistry::class);
foreach (['catalog_category_product', 'catalog_product_price', 'catalogsearch_fulltext'] as $indexerId) {
    $indexerRegistry->get($indexerId)->reindexAll();
}
