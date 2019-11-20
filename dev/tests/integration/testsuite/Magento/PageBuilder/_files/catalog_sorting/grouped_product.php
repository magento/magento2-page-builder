<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\Product;
use Magento\Catalog\Model\Product\Attribute\Source\Status;
use Magento\Catalog\Model\Product\Type;
use Magento\Catalog\Model\Product\Visibility;
use Magento\GroupedProduct\Model\Product\Type\Grouped;
use Magento\TestFramework\Helper\Bootstrap;

/** @var ProductRepositoryInterface $productRepository */
$productRepository = Bootstrap::getObjectManager()
    ->get(ProductRepositoryInterface::class);
/** @var $categoryLinkManagement \Magento\Catalog\Api\CategoryLinkManagementInterface */
$categoryLinkManagement = Bootstrap::getObjectManager()->create(\Magento\Catalog\Api\CategoryLinkManagementInterface::class);

$productLinkFactory = Bootstrap::getObjectManager()
    ->get(\Magento\Catalog\Api\Data\ProductLinkInterfaceFactory::class);
$productConfigs = [
    [
        'id' => '100000001',
        'price' => 80,
        'stock_config' => ['use_config_manage_stock' => 1, 'qty' => 80, 'is_qty_decimal' => 0, 'is_in_stock' => 1]
    ],
    [
        'id' => '100000002',
        'price' => 60,
        'stock_config' =>  ['use_config_manage_stock' => 1, 'qty' => 60, 'is_qty_decimal' => 0, 'is_in_stock' => 1]
    ]
];

foreach ($productConfigs as $productConfig) {
    /** @var $product Product */
    $product = Bootstrap::getObjectManager()->create(Product::class);
    $product->setTypeId(Type::TYPE_SIMPLE)
        ->setId($productConfig['id'])
        ->setWebsiteIds([1])
        ->setAttributeSetId(4)
        ->setName('Simple ' . $productConfig['id'])
        ->setSku('simple_' . $productConfig['id'])
        ->setPrice($productConfig['price'])
        ->setVisibility(Visibility::VISIBILITY_BOTH)
        ->setStatus(Status::STATUS_ENABLED)
        ->setStockData($productConfig['stock_config']);

    $linkedProducts[] = $productRepository->save($product);
    $categoryLinkManagement->assignProductToCategories(
        $product->getSku(),
        [2]
    );
}

/** @var $product Product */
$product = Bootstrap::getObjectManager()->create(Product::class);

$product->setTypeId(Grouped::TYPE_CODE)
    ->setId('100000003')
    ->setWebsiteIds([1])
    ->setAttributeSetId(4)
    ->setName('Grouped Product')
    ->setSku('grouped')
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED)
    ->setStockData(['use_config_manage_stock' => 1, 'is_in_stock' => 1]);

foreach ($linkedProducts as $linkedProduct) {
    /** @var \Magento\Catalog\Api\Data\ProductLinkInterface $productLink */
    $productLink = $productLinkFactory->create();
    $productLink->setSku($product->getSku())
        ->setLinkType('associated')
        ->setLinkedProductSku($linkedProduct->getSku())
        ->setLinkedProductType($linkedProduct->getTypeId())
        ->getExtensionAttributes()
        ->setQty(1);
    $newLinks[] = $productLink;
}

$product->setProductLinks($newLinks);

$productRepository->save($product);
$categoryLinkManagement->assignProductToCategories(
    $product->getSku(),
    [2]
);
