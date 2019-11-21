<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

use Magento\Catalog\Api\CategoryLinkManagementInterface;
use Magento\Catalog\Api\CategoryLinkRepositoryInterface;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\Product;
use Magento\Catalog\Model\Product\Attribute\Source\Status;
use Magento\Catalog\Model\Product\Type;
use Magento\Catalog\Model\Product\Visibility;
use Magento\Msrp\Model\Product\Attribute\Source\Type as PriceType;
use Magento\TestFramework\Helper\Bootstrap;

$objectManager = Bootstrap::getObjectManager();

$productRepository = $objectManager->create(ProductRepositoryInterface::class);

/* @var CategoryLinkRepositoryInterface $categoryLinkRepository */
$categoryLinkRepository = $objectManager->create(
    CategoryLinkRepositoryInterface::class,
    [
        'productRepository' => $productRepository
    ]
);

/** @var CategoryLinkManagementInterface $linkManagement */
$categoryLinkManagement = $objectManager->create(CategoryLinkManagementInterface::class);
$reflectionClass = new \ReflectionClass(get_class($categoryLinkManagement));
$properties = [
    'productRepository' => $productRepository,
    'categoryLinkRepository' => $categoryLinkRepository
];
foreach ($properties as $key => $value) {
    if ($reflectionClass->hasProperty($key)) {
        $reflectionProperty = $reflectionClass->getProperty($key);
        $reflectionProperty->setAccessible(true);
        $reflectionProperty->setValue($categoryLinkManagement, $value);
    }
}

/** @var $product Product */
$product = $objectManager->create(Product::class);
$product->isObjectNew(true);
$product->setTypeId(Type::TYPE_SIMPLE)
    ->setAttributeSetId(4)
    ->setName('Simple Product1')
    ->setSku('simple1')
    ->setTaxClassId('none')
    ->setDescription('description')
    ->setShortDescription('short description')
    ->setOptionsContainer('container1')
    ->setMsrpDisplayActualPriceType(PriceType::TYPE_IN_CART)
    ->setPrice(10)
    ->setWeight(1)
    ->setMetaTitle('meta title')
    ->setMetaKeyword('meta keyword')
    ->setMetaDescription('meta description')
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED)
    ->setWebsiteIds([1])
    ->setCategoryIds([])
    ->setStockData(
        [
            'use_config_manage_stock' => 1,
            'qty' => 100,
            'is_qty_decimal' => 0,
            'is_in_stock' => 1,
            'manage_stock' => 1,
        ]
    );

$productRepository->save($product);

$categoryLinkManagement->assignProductToCategories(
    $product->getSku(),
    [2, 3]
);

$product = $objectManager->create(Product::class);
$product->isObjectNew(true);
$product->setTypeId(Type::TYPE_SIMPLE)
    ->setAttributeSetId(4)
    ->setName('Simple Product2')
    ->setSku('simple2')
    ->setTaxClassId('none')
    ->setDescription('description')
    ->setShortDescription('short description')
    ->setOptionsContainer('container1')
    ->setMsrpDisplayActualPriceType(PriceType::TYPE_ON_GESTURE)
    ->setPrice(20)
    ->setWeight(1)
    ->setMetaTitle('meta title')
    ->setMetaKeyword('meta keyword')
    ->setMetaDescription('meta description')
    ->setVisibility(Visibility::VISIBILITY_IN_CATALOG)
    ->setStatus(Status::STATUS_ENABLED)
    ->setWebsiteIds([1])
    ->setCategoryIds([])
    ->setStockData(
        [
            'use_config_manage_stock' => 1,
            'qty' => 50,
            'is_qty_decimal' => 0,
            'is_in_stock' => 1,
            'manage_stock' => 1,
        ]
    );

$productRepository->save($product);

$categoryLinkManagement->assignProductToCategories(
    $product->getSku(),
    [2, 3]
);

$product = $objectManager->create(Product::class);
$product->isObjectNew(true);
$product->setTypeId(Type::TYPE_SIMPLE)
    ->setAttributeSetId(4)
    ->setName('Simple Product 3')
    ->setSku('simple3')
    ->setTaxClassId('none')
    ->setDescription('description')
    ->setShortDescription('short description')
    ->setPrice(30)
    ->setWeight(1)
    ->setVisibility(Visibility::VISIBILITY_IN_CATALOG)
    ->setStatus(Status::STATUS_ENABLED)
    ->setWebsiteIds([1])
    ->setCategoryIds([])
    ->setStockData(
        [
            'use_config_manage_stock' => 1,
            'qty' => 140,
            'is_qty_decimal' => 0,
            'is_in_stock' => 1,
            'manage_stock' => 1,
        ]
    );

$productRepository->save($product);

$categoryLinkManagement->assignProductToCategories(
    $product->getSku(),
    [2, 3]
);
