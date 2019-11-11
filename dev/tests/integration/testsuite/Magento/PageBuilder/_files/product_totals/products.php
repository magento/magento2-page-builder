<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
$objectManager = \Magento\TestFramework\Helper\Bootstrap::getObjectManager();

$defaultAttributeSet = $objectManager->get(Magento\Eav\Model\Config::class)
    ->getEntityType('catalog_product')
    ->getDefaultAttributeSetId();

$productRepository = $objectManager->create(
    \Magento\Catalog\Api\ProductRepositoryInterface::class
);

$categoryLinkRepository = $objectManager->create(
    \Magento\Catalog\Api\CategoryLinkRepositoryInterface::class,
    [
        'productRepository' => $productRepository
    ]
);

/** @var Magento\Catalog\Api\CategoryLinkManagementInterface $linkManagement */
$categoryLinkManagement = $objectManager->create(\Magento\Catalog\Api\CategoryLinkManagementInterface::class);
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
/** @var $category \Magento\Catalog\Model\Category */
$category = $objectManager->create(\Magento\Catalog\Model\Category::class);
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

$category = $objectManager->create(\Magento\Catalog\Model\Category::class);
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
     * @throws Exception
     */
    function createTestProduct($name, $sku, $modifier, $objectManager, $defaultAttributeSet, $categoryLinkManagement)
    {
        /** @var $product \Magento\Catalog\Model\Product */
        $product = $objectManager->create(\Magento\Catalog\Model\Product::class);
        $product->isObjectNew(true);
        $product->setTypeId(\Magento\Catalog\Model\Product\Type::TYPE_SIMPLE)
            ->setAttributeSetId($defaultAttributeSet)
            ->setStoreId(1)
            ->setWebsiteIds([1])
            ->setName($name)
            ->setSku($sku)
            ->setPrice(10)
            ->setWeight(18)
            ->setQuantityAndStockStatus(['qty' => 10, 'is_in_stock' => 1])
            ->setVisibility(\Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH)
            ->setStatus(\Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED);

        if ($modifier) {
            $product = $modifier($product);
        }

        $product->save();

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
    $categoryLinkManagement
);

// Create same product as above with SKU as numbers
createTestProduct(
    'Simple Product Two',
    '12345',
    function (\Magento\Catalog\Model\Product $product) {
        $product->setPrice(45.67);
        $product->setWeight(56);
        return $product;
    },
    $objectManager,
    $defaultAttributeSet,
    $categoryLinkManagement
);

// Create a product not visible on store front
createTestProduct(
    'Not Visible on Storefront',
    'not-visible-on-storefront',
    function (\Magento\Catalog\Model\Product $product) {
        $product->setPrice(15);
        $product->setWeight(2);
        $product->setVisibility(\Magento\Catalog\Model\Product\Visibility::VISIBILITY_NOT_VISIBLE);
        return $product;
    },
    $objectManager,
    $defaultAttributeSet,
    $categoryLinkManagement
);

// Create disabled product
createTestProduct(
    'Disabled Product',
    'disabled-product',
    function (\Magento\Catalog\Model\Product $product) {
        $product->setStatus(\Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_DISABLED);
        return $product;
    },
    $objectManager,
    $defaultAttributeSet,
    $categoryLinkManagement
);
