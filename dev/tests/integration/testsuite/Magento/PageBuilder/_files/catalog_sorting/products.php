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

/** @var \Magento\Catalog\Model\Product $productWithCatalogPriceRule */
$productWithCatalogPriceRule = $objectManager->create(\Magento\Catalog\Model\Product::class);
$productWithCatalogPriceRule->setTypeId(\Magento\Catalog\Model\Product\Type::TYPE_SIMPLE)
    ->setId(670)
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
    ->setVisibility(\Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH)
    ->setStatus(\Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED);
$productRepository->save($productWithCatalogPriceRule);

/** @var \Magento\Catalog\Model\Product $productWithCatalogPriceRule */
$virtualProduct = $objectManager->create(\Magento\Catalog\Model\Product::class);
$virtualProduct->setTypeId(\Magento\Catalog\Model\Product\Type::TYPE_VIRTUAL)
    ->setId(671)
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
    ->setVisibility(\Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH)
    ->setStatus(\Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED);
$productRepository->save($virtualProduct);

/** @var \Magento\Store\Model\Website $secondWebsite */
$secondWebsite = $objectManager->create(\Magento\Store\Model\Website::class);
$secondWebsite->setName('Second Website')
    ->setCode('second_website')
    ->save();
/** @var \Magento\Catalog\Model\Product $productInSecondWebsite */
$productInSecondWebsite = $objectManager->create(\Magento\Catalog\Model\Product::class);
$productInSecondWebsite->setTypeId('simple')
    ->setId(672)
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
    ->setVisibility(\Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH)
    ->setStatus(\Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED);
$productRepository->save($productInSecondWebsite);

/** @var \Magento\Catalog\Model\Product $giftCardProduct */
$giftCardProduct = $objectManager->create(\Magento\Catalog\Model\Product::class);
$giftCardProduct->setTypeId(\Magento\GiftCard\Model\Catalog\Product\Type\Giftcard::TYPE_GIFTCARD)
    ->setId(673)
    ->setCreatedAt('2019-01-07 01:01:01')
    ->setUpdatedAt('2019-01-07 01:01:01')
    ->setAttributeSetId(4)
    ->setStoreId(1)
    ->setWebsiteIds([1])
    ->setName('Gift Card')
    ->setSku('gift-card')
    ->setPrice(10)
    ->setVisibility(\Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH)
    ->setStatus(\Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED)
    ->setStockData(['use_config_manage_stock' => 0])
    ->setCanSaveCustomOptions(true)
    ->setHasOptions(true)
    ->setGiftcardType(\Magento\GiftCard\Model\Giftcard::TYPE_VIRTUAL)
    ->setAllowOpenAmount(1)->save();
$productRepository->save($giftCardProduct);

/** @var \Magento\Catalog\Model\Product $oosProduct */
$oosProduct = $objectManager->create(\Magento\Catalog\Model\Product::class);
$oosProduct->setTypeId(\Magento\Catalog\Model\Product\Type::TYPE_SIMPLE)
    ->setId(674)
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
    ->setVisibility(\Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH)
    ->setStatus(\Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED);
$productRepository->save($oosProduct);

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
    'OOS_PB_PRODUCT' => 9
];

foreach ($productPositions as $sku => $position) {
    $productLink = $objectManager->create(\Magento\Catalog\Api\Data\CategoryProductLinkInterface::class)
        ->setSku($sku)
        ->setPosition($position)
        ->setCategoryId(333);
    $categoryLinkRepository->save($productLink);
    $categoryLinkManagement->assignProductToCategories($sku, [2, 333]);
}
