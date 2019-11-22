<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

use Magento\Catalog\Api\CategoryLinkManagementInterface;
use Magento\Catalog\Api\CategoryLinkRepositoryInterface;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\Category;
use Magento\Catalog\Model\Product;
use Magento\Catalog\Model\Product\Attribute\Source\Status;
use Magento\Catalog\Model\Product\Type;
use Magento\Catalog\Model\Product\Visibility;
use Magento\Eav\Model\Config;
use Magento\TestFramework\Helper\Bootstrap;

$objectManager = Bootstrap::getObjectManager();

$defaultAttributeSet = $objectManager->get(Config::class)
    ->getEntityType('catalog_product')
    ->getDefaultAttributeSetId();

/* @var ProductRepositoryInterface $productRepository */
$productRepository = $objectManager->create(
    ProductRepositoryInterface::class
);

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

/**
 * After installation system has two categories: root one with ID:1 and Default category with ID:2
 */
/** @var $category Category */
$category = $objectManager->create(Category::class);
$category->isObjectNew(true);
$category->setId(3)
    ->setName('Category 1')
    ->setParentId(2)
    ->setPath('1/2/3')
    ->setLevel(2)
    ->setAvailableSortBy('name')
    ->setDefaultSortBy('name')
    ->setIsActive(true)
    ->setPosition(1)
    ->save();

$category = $objectManager->create(Category::class);
$category->isObjectNew(true);
$category->setId(4)
    ->setName('Category 1.1')
    ->setParentId(3)
    ->setPath('1/2/3/4')
    ->setLevel(3)
    ->setAvailableSortBy('name')
    ->setDefaultSortBy('name')
    ->setIsActive(true)
    ->setIsAnchor(true)
    ->setPosition(1)
    ->setDescription('Category 1.1 description.')
    ->save();

if (!function_exists('createTestProduct')) {
    /**
     * Create a test product
     *
     * @param $name
     * @param $sku
     * @param $modifier
     * @param $objectManager
     * @param $defaultAttributeSet
     * @param $categoryLinkManagement
     * @param $productRepository
     * @throws Exception
     */
    function createTestProduct(
        $name,
        $sku,
        $modifier,
        $objectManager,
        $defaultAttributeSet,
        $categoryLinkManagement,
        $productRepository
    ) {
        /** @var $product Product */
        $product = $objectManager->create(Product::class);
        $product->isObjectNew(true);
        $product->setTypeId(Type::TYPE_SIMPLE)
            ->setAttributeSetId($defaultAttributeSet)
            ->setStoreId(1)
            ->setWebsiteIds([1])
            ->setName($name)
            ->setSku($sku)
            ->setPrice(10)
            ->setWeight(18)
            ->setQuantityAndStockStatus(['qty' => 10, 'is_in_stock' => 1])
            ->setVisibility(Visibility::VISIBILITY_BOTH)
            ->setStatus(Status::STATUS_ENABLED);

        if ($modifier) {
            $product = $modifier($product);
        }

        $productRepository->save($product);

        $categoryLinkManagement->assignProductToCategories(
            $product->getSku(),
            [2, 3]
        );
    }
}

// Create simple in stock, visible and enabled product
createTestProduct(
    'Simple Product',
    'simple',
    false,
    $objectManager,
    $defaultAttributeSet,
    $categoryLinkManagement,
    $productRepository
);

// Create same product as above with SKU as numbers
createTestProduct(
    'Simple Product Two',
    '12345',
    function (Product $product) {
        $product->setPrice(45.67);
        $product->setWeight(56);
        return $product;
    },
    $objectManager,
    $defaultAttributeSet,
    $categoryLinkManagement,
    $productRepository
);

// Create a product not visible on store front
createTestProduct(
    'Not Visible on Storefront',
    'not-visible-on-storefront',
    function (Product $product) {
        $product->setPrice(15);
        $product->setWeight(2);
        $product->setVisibility(Visibility::VISIBILITY_NOT_VISIBLE);
        return $product;
    },
    $objectManager,
    $defaultAttributeSet,
    $categoryLinkManagement,
    $productRepository
);

// Create disabled product
createTestProduct(
    'Disabled Product',
    'disabled-product',
    function (Product $product) {
        $product->setStatus(Status::STATUS_DISABLED);
        return $product;
    },
    $objectManager,
    $defaultAttributeSet,
    $categoryLinkManagement,
    $productRepository
);

// Create an out of stock product
createTestProduct(
    'Out of Stock Product',
    'out-of-stock',
    function (Product $product) {
        $product->setPrice(22.50);
        $product->setWeight(100);
        $product->setQuantityAndStockStatus(
            [
                'qty' => 0,
                'is_in_stock' => \Magento\CatalogInventory\Model\Stock\Status::STATUS_OUT_OF_STOCK
            ]
        );
        return $product;
    },
    $objectManager,
    $defaultAttributeSet,
    $categoryLinkManagement,
    $productRepository
);

// Create a disabled, not visible product
createTestProduct(
    'Disabled & Not Visible Product',
    'disabled-not-visible-product',
    function (Product $product) {
        $product->setPrice(45);
        $product->setWeight(2);
        $product->setVisibility(Visibility::VISIBILITY_NOT_VISIBLE);
        $product->setStatus(Status::STATUS_DISABLED);
        return $product;
    },
    $objectManager,
    $defaultAttributeSet,
    $categoryLinkManagement,
    $productRepository
);

// Create a disabled, out of stock, not visible product
createTestProduct(
    'Disabled OOS Not Visible',
    'disabled-out-of-stock-not-visible',
    function (Product $product) {
        $product->setPrice(150);
        $product->setWeight(22);
        $product->setQuantityAndStockStatus(
            [
                'qty' => 0,
                'is_in_stock' => \Magento\CatalogInventory\Model\Stock\Status::STATUS_OUT_OF_STOCK
            ]
        );
        $product->setVisibility(Visibility::VISIBILITY_NOT_VISIBLE);
        $product->setStatus(Status::STATUS_DISABLED);
        return $product;
    },
    $objectManager,
    $defaultAttributeSet,
    $categoryLinkManagement,
    $productRepository
);

// Create a standard virtual product
createTestProduct(
    'Virtual Product',
    'virtual-product',
    function (Product $product) {
        $product->setPrice(150);
        $product->setWeight(22);
        $product->setTypeId(Type::TYPE_VIRTUAL);
        return $product;
    },
    $objectManager,
    $defaultAttributeSet,
    $categoryLinkManagement,
    $productRepository
);

// Create a gift card product
if (class_exists('Magento\GiftCard\Model\Giftcard')) {
    createTestProduct(
        'Simple Gift Card',
        'gift-card',
        function (Product $product) {
            $product->setPrice(10);
            $product->setTypeId(\Magento\GiftCard\Model\Catalog\Product\Type\Giftcard::TYPE_GIFTCARD);
            $product->setStockData(['use_config_manage_stock' => 0]);
            $product->setCanSaveCustomOptions(true);
            $product->setHasOptions(true);
            $product->setAllowOpenAmount(1);
            $product->setGiftcardType(\Magento\GiftCard\Model\Giftcard::TYPE_VIRTUAL);
            return $product;
        },
        $objectManager,
        $defaultAttributeSet,
        $categoryLinkManagement,
        $productRepository
    );
}
