<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

use Magento\Catalog\Api\CategoryLinkManagementInterface;
use Magento\Catalog\Api\CategoryLinkRepositoryInterface;
use Magento\Catalog\Api\Data\CategoryProductLinkInterface;
use Magento\Catalog\Model\Category;
use Magento\Catalog\Model\Product;
use Magento\Catalog\Model\Product\Attribute\Source\Status;
use Magento\Catalog\Model\Product\Type;
use Magento\Catalog\Model\Product\Visibility;
use Magento\Catalog\Model\ProductRepository;
use Magento\GiftCard\Model\Giftcard;
use Magento\GiftCard\Model\Catalog\Product\Type\Giftcard as GiftcardType;
use Magento\Store\Model\Website;
use Magento\TestFramework\Helper\Bootstrap;

$objectManager = Bootstrap::getObjectManager();

$category = $objectManager->create(Category::class);
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

/* @var $productRepository ProductRepository */
$productRepository = $objectManager->create(ProductRepository::class);
$categoryLinkRepository = $objectManager->create(
    CategoryLinkRepositoryInterface::class,
    [
        'productRepository' => $productRepository
    ]
);
/** @var $categoryLinkManagement CategoryLinkManagementInterface */
$categoryLinkManagement = $objectManager->create(CategoryLinkManagementInterface::class);
/** @var $firstProduct Product */
$firstProduct = $objectManager->create(Product::class);
$firstProduct->setTypeId(Type::TYPE_SIMPLE)
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
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED);

$productRepository->save($firstProduct);

/** @var $secondProduct Product */
$secondProduct = $objectManager->create(Product::class);
$secondProduct->setTypeId(Type::TYPE_SIMPLE)
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
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED);

$productRepository->save($secondProduct);

/** @var $thirdProduct Product */
$thirdProduct = $objectManager->create(Product::class);
$thirdProduct->setTypeId(Type::TYPE_SIMPLE)
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
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED);

$productRepository->save($thirdProduct);

/** @var $fourthProduct Product */
$fourthProduct = $objectManager->create(Product::class);
$fourthProduct->setTypeId(Type::TYPE_SIMPLE)
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
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED);

$productRepository->save($fourthProduct);

/** @var Product $productWithCatalogPriceRule */
$productWithCatalogPriceRule = $objectManager->create(Product::class);
$productWithCatalogPriceRule->setTypeId(Type::TYPE_SIMPLE)
    ->setCreatedAt('2018-01-05 01:01:01')
    ->setUpdatedAt('2018-01-05 01:01:01')
    ->setAttributeSetId(4)
    ->setStoreId(1)
    ->setWebsiteIds([1])
    ->setName('Page Builder Product with Catalog Price Rule')
    ->setSku('PB_PRODUCT_CPR')
    ->setPrice(66)
    ->setStockData(
        [
            'qty' => 66,
            'is_in_stock' => true
        ]
    )
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED);
$productRepository->save($productWithCatalogPriceRule);

/** @var Product $productWithCatalogPriceRule */
$virtualProduct = $objectManager->create(Product::class);
$virtualProduct->setTypeId(Type::TYPE_VIRTUAL)
    ->setCreatedAt('2018-01-06 01:01:01')
    ->setUpdatedAt('2018-01-06 01:01:01')
    ->setAttributeSetId(4)
    ->setStoreId(1)
    ->setWebsiteIds([1])
    ->setName('Page Builder Virtual Product')
    ->setSku('PB_VIRTUAL_PRODUCT')
    ->setPrice(88)
    ->setStockData(
        [
            'qty' => 88,
            'is_in_stock' => true
        ]
    )
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED);
$productRepository->save($virtualProduct);

/** @var Website $secondWebsite */
$secondWebsite = $objectManager->create(Website::class);
$secondWebsite->setName('Second Website')
    ->setCode('second_website')
    ->save();
/** @var Product $productInSecondWebsite */
$productInSecondWebsite = $objectManager->create(Product::class);
$productInSecondWebsite->setTypeId(Type::TYPE_SIMPLE)
    ->setCreatedAt('2018-01-07 01:01:01')
    ->setUpdatedAt('2018-01-07 01:01:01')
    ->setAttributeSetId(4)
    ->setStoreId(1)
    ->setWebsiteIds([$secondWebsite->getId()])
    ->setName('Simple Product Second Website')
    ->setSku('simple_second_website')
    ->setPrice(20)
    ->setWeight(0)
    ->setTierPrices()
    ->setStockData(
        [
            'qty' => 25,
            'is_in_stock' => true
        ]
    )
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED);
$productRepository->save($productInSecondWebsite);

/** @var Product $giftCardProduct */
$giftCardProduct = $objectManager->create(Product::class);
$giftCardProduct->setTypeId(GiftcardType::TYPE_GIFTCARD)
    ->setCreatedAt('2019-01-07 01:01:01')
    ->setUpdatedAt('2019-01-07 01:01:01')
    ->setAttributeSetId(4)
    ->setStoreId(1)
    ->setWebsiteIds([1])
    ->setName('Gift Card')
    ->setSku('gift-card')
    ->setPrice(10)
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED)
    ->setStockData(['use_config_manage_stock' => 0])
    ->setCanSaveCustomOptions(true)
    ->setHasOptions(true)
    ->setGiftcardType(Giftcard::TYPE_VIRTUAL)
    ->setAllowOpenAmount(1)->save();
$productRepository->save($giftCardProduct);

/** @var Product $oosProduct */
$oosProduct = $objectManager->create(Product::class);
$oosProduct->setTypeId(Type::TYPE_SIMPLE)
    ->setCreatedAt('2007-01-05 01:01:01')
    ->setUpdatedAt('2007-01-05 01:01:01')
    ->setAttributeSetId(4)
    ->setStoreId(1)
    ->setWebsiteIds([1])
    ->setName('OOS Page Builder Product')
    ->setSku('OOS_PB_PRODUCT')
    ->setPrice(99)
    ->setWeight(0)
    ->setTierPrices()
    ->setStockData(
        [
            'qty' => 0,
            'is_in_stock' => false
        ]
    )
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED);
$productRepository->save($oosProduct);

/** @var Product $zeroQuantityProduct */
$zeroQuantityInStockProduct = $objectManager->create(Product::class);
$zeroQuantityInStockProduct->setTypeId(Type::TYPE_SIMPLE)
    ->setAttributeSetId(4)
    ->setStoreId(1)
    ->setWebsiteIds([1])
    ->setName('Zero Quantity In Stock Product')
    ->setSku('ZERO_QTY_IN_STOCK_PRODUCT')
    ->setPrice(98)
    ->setWeight(0)
    ->setStockData(
        [
            'qty' => 0,
            'is_in_stock' => true
        ]
    )
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED);
$productRepository->save($zeroQuantityInStockProduct);

/** @var Product $zeroQuantityProduct */
$specialPriceProduct = $objectManager->create(Product::class);
$specialPriceProduct->setTypeId(Type::TYPE_SIMPLE)
    ->setAttributeSetId(4)
    ->setStoreId(1)
    ->setWebsiteIds([1])
    ->setName('Special Price Product')
    ->setSku('special_price_product')
    ->setPrice(999)
    ->setSpecialPrice('1.99')
    ->setWeight(0)
    ->setStockData(
        [
            'qty' => 1000,
            'is_in_stock' => true
        ]
    )
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED);
$productRepository->save($specialPriceProduct);

// assign positions and categories
$productPositions = [
    '1_PB_PRODUCT' => 3,
    'a_pb_product' => 2,
    'B_PB_PRODUCT' => 1,
    'C_PB_PRODUCT' => 4,
    'PB_PRODUCT_CPR' => 5,
    'PB_VIRTUAL_PRODUCT' => 6,
    'simple_second_website' => 7,
    'gift-card' => 8,
    'OOS_PB_PRODUCT' => 9,
    'ZERO_QTY_IN_STOCK_PRODUCT' => 10,
    'special_price_product' => 11
];

foreach ($productPositions as $sku => $position) {
    $productLink = $objectManager->create(CategoryProductLinkInterface::class)
        ->setSku($sku)
        ->setPosition($position)
        ->setCategoryId(333);
    $categoryLinkRepository->save($productLink);
    $categoryLinkManagement->assignProductToCategories($sku, [2, 333]);
}
