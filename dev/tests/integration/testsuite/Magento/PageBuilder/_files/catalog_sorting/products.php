<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

$objectManager = \Magento\TestFramework\Helper\Bootstrap::getObjectManager();

$category = $objectManager->create(\Magento\Catalog\Model\Category::class);
$category->isObjectNew(true);
$category->setId(333)
    ->setName('pbcategory')
    ->setParentId(2)
    ->setPath('1/2/333')
    ->setLevel(2)
    ->setAvailableSortBy('name', 'position')
    ->setDefaultSortBy('name')
    ->setIsActive(true)
    ->setPosition(1)
    ->save();

/* @var $productRepository \Magento\Catalog\Model\ProductRepository */
$productRepository = $objectManager->create(\Magento\Catalog\Model\ProductRepository::class);
$categoryLinkRepository = $objectManager->create(
    \Magento\Catalog\Api\CategoryLinkRepositoryInterface::class,
    [
        'productRepository' => $productRepository
    ]
);
/** @var $categoryLinkManagement \Magento\Catalog\Api\CategoryLinkManagementInterface */
$categoryLinkManagement = $objectManager->create(\Magento\Catalog\Api\CategoryLinkManagementInterface::class);
/** @var $firstProduct \Magento\Catalog\Model\Product */
$firstProduct = $objectManager->create(\Magento\Catalog\Model\Product::class);
$firstProduct->setTypeId(\Magento\Catalog\Model\Product\Type::TYPE_SIMPLE)
    ->setId(666)
    ->setCreatedAt('2010-01-01 01:01:01')
    ->setUpdatedAt('2010-01-01 01:01:01')
    ->setAttributeSetId(4)
    ->setStoreId(1)
    ->setWebsiteIds([1])
    ->setName('A Page Builder Product')
    ->setSku('a_pb_product')
    ->setPrice(50)
    ->setWeight(0)
    ->setStockData(
        [
            'qty' => 5,
            'is_in_stock' => true
        ]
    )
    ->setVisibility(\Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH)
    ->setStatus(\Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED);

$productRepository->save($firstProduct);

/** @var $secondProduct \Magento\Catalog\Model\Product */
$secondProduct = $objectManager->create(\Magento\Catalog\Model\Product::class);
$secondProduct->setTypeId(\Magento\Catalog\Model\Product\Type::TYPE_SIMPLE)
    ->setId(667)
    ->setCreatedAt('2017-01-01 01:01:01')
    ->setUpdatedAt('2017-01-01 01:01:01')
    ->setAttributeSetId(4)
    ->setStoreId(1)
    ->setWebsiteIds([1])
    ->setName('B Page Builder Product')
    ->setSku('B_PB_PRODUCT')
    ->setPrice(0)
    ->setWeight(0)
    ->setStockData(
        [
            'qty' => 1,
            'is_in_stock' => true
        ]
    )
    ->setVisibility(\Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH)
    ->setStatus(\Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED);

$productRepository->save($secondProduct);

/** @var $thirdProduct \Magento\Catalog\Model\Product */
$thirdProduct = $objectManager->create(\Magento\Catalog\Model\Product::class);
$thirdProduct->setTypeId(\Magento\Catalog\Model\Product\Type::TYPE_SIMPLE)
    ->setId(668)
    ->setCreatedAt('2000-01-01 01:01:01')
    ->setUpdatedAt('2000-01-01 01:01:01')
    ->setAttributeSetId(4)
    ->setStoreId(1)
    ->setWebsiteIds([1])
    ->setName('c Page Builder Product')
    ->setSku('C_PB_PRODUCT')
    ->setPrice(35)
    ->setWeight(0)
    ->setStockData(
        [
            'qty' => 150,
            'is_in_stock' => true
        ]
    )
    ->setVisibility(\Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH)
    ->setStatus(\Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED);

$productRepository->save($thirdProduct);

/** @var $fourthProduct \Magento\Catalog\Model\Product */
$fourthProduct = $objectManager->create(\Magento\Catalog\Model\Product::class);
$fourthProduct->setTypeId(\Magento\Catalog\Model\Product\Type::TYPE_SIMPLE)
    ->setId(669)
    ->setCreatedAt('2017-01-05 01:01:01')
    ->setUpdatedAt('2017-01-05 01:01:01')
    ->setAttributeSetId(4)
    ->setStoreId(1)
    ->setWebsiteIds([1])
    ->setName('1 Page Builder Product')
    ->setSku('1_PB_PRODUCT')
    ->setPrice(99)
    ->setWeight(0)
    ->setStockData(
        [
            'qty' => 2,
            'is_in_stock' => true
        ]
    )
    ->setVisibility(\Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH)
    ->setStatus(\Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED);

$productRepository->save($fourthProduct);

$productPositions = [
    '1_PB_PRODUCT' => 3,
    'a_pb_product' => 2,
    'B_PB_PRODUCT' => 1,
    'C_PB_PRODUCT' => 4
];

foreach ($productPositions as $sku => $position) {
    $productLink = $objectManager->create(\Magento\Catalog\Api\Data\CategoryProductLinkInterface::class)
        ->setSku($sku)
        ->setPosition($position)
        ->setCategoryId(333);
    $categoryLinkRepository->save($productLink);
    $categoryLinkManagement->assignProductToCategories($sku, [333]);
}
