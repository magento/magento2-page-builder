<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

require __DIR__ . '/multiple_products.php';

$objectManager = \Magento\TestFramework\Helper\Bootstrap::getObjectManager();
$productRepository = $objectManager->create(\Magento\Catalog\Api\ProductRepositoryInterface::class);

/* @var \Magento\Catalog\Api\CategoryLinkRepositoryInterface $categoryLinkRepository */
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

/** @var \Magento\Catalog\Model\Product $bundleProduct */
$bundleProduct = $objectManager->create(\Magento\Catalog\Model\Product::class);
$bundleProduct->setTypeId(\Magento\Catalog\Model\Product\Type::TYPE_BUNDLE)
    ->setAttributeSetId(4)
    ->setWebsiteIds([1])
    ->setName('Bundle Product')
    ->setSku('bundle_product')
    ->setVisibility(\Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH)
    ->setStatus(\Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED)
    ->setStockData(['use_config_manage_stock' => 1, 'is_in_stock' => 1])
    ->setPriceView(0)
    ->setPriceType(\Magento\Bundle\Model\Product\Price::PRICE_TYPE_FIXED)
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

    $option = $objectManager->create(\Magento\Bundle\Api\Data\OptionInterfaceFactory::class)
        ->create(['data' => $optionData])
        ->setSku($bundleProduct->getSku());

    foreach ($linksData as $linkData) {
        $links[] = $objectManager->create(\Magento\Bundle\Api\Data\LinkInterfaceFactory::class)
            ->create(['data' => $linkData]);
    }

    $option->setProductLinks($links);
    $options[] = $option;
}

$extension = $bundleProduct->getExtensionAttributes();
$extension->setBundleProductOptions($options);
$bundleProduct->setExtensionAttributes($extension);
$productRepository->save($bundleProduct);
