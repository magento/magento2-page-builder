<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

require __DIR__ . '/multiple_products.php';

use Magento\Bundle\Api\Data\LinkInterfaceFactory;
use Magento\Bundle\Api\Data\OptionInterfaceFactory;
use Magento\Bundle\Model\Product\Price;
use Magento\Catalog\Api\CategoryLinkManagementInterface;
use Magento\Catalog\Api\CategoryLinkRepositoryInterface;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\Product;
use Magento\Catalog\Model\Product\Attribute\Source\Status;
use Magento\Catalog\Model\Product\Type;
use Magento\Catalog\Model\Product\Visibility;
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

/** @var Product $bundleProduct */
$bundleProduct = $objectManager->create(Product::class);
$bundleProduct->setTypeId(Type::TYPE_BUNDLE)
    ->setAttributeSetId(4)
    ->setWebsiteIds([1])
    ->setName('Bundle Product')
    ->setSku('bundle_product')
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED)
    ->setStockData(['use_config_manage_stock' => 1, 'is_in_stock' => 1])
    ->setPriceView(0)
    ->setPriceType(Price::PRICE_TYPE_FIXED)
    ->setPrice(110.0)
    ->setShipmentType(0)->save();

$productRepository->save($bundleProduct);

$categoryLinkManagement->assignProductToCategories(
    $bundleProduct->getSku(),
    [2]
);

/** Add product links */
$options = [];
$optionsData = [
    [
        'title' => 'op1',
        'required' => true,
        'type' => 'checkbox',
        'links' => [
            [
                'sku' => 'simple1',
                'qty' => 3,
            ],
            [
                'sku' => 'simple2',
                'qty' => 2,
            ],
            [
                'sku' => 'simple3',
                'qty' => 1,
            ],
        ]
    ]
];
foreach ($optionsData as $optionData) {
    $links = [];
    $linksData = $optionData['links'];
    unset($optionData['links']);

    $option = $objectManager->create(OptionInterfaceFactory::class)
        ->create(['data' => $optionData])
        ->setSku($bundleProduct->getSku());

    foreach ($linksData as $linkData) {
        $links[] = $objectManager->create(LinkInterfaceFactory::class)
            ->create(['data' => $linkData]);
    }

    $option->setProductLinks($links);
    $options[] = $option;
}

$extension = $bundleProduct->getExtensionAttributes();
$extension->setBundleProductOptions($options);
$bundleProduct->setExtensionAttributes($extension);
$productRepository->save($bundleProduct);
