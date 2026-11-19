<?php
/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\ResourceModel\Category\CollectionFactory;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Registry;
use Magento\TestFramework\Helper\Bootstrap;

$objectManager = Bootstrap::getObjectManager();
$registry = $objectManager->get(Registry::class);
$registry->unregister('isSecureArea');
$registry->register('isSecureArea', true);

$productRepository = $objectManager->get(ProductRepositoryInterface::class);
$skus = ['pcl_zebra', 'pcl_alpha', 'pcl_yankee', 'pcl_disabled', 'pcl_out_of_stock', 'pcl_not_visible'];

foreach ($skus as $sku) {
    try {
        $productRepository->delete($productRepository->get($sku, false, null, true));
    } catch (NoSuchEntityException $exception) {
        continue;
    }
}

$categoryRepository = $objectManager->get(CategoryRepositoryInterface::class);
$categoryCollection = $objectManager->get(CollectionFactory::class)->create();
$categoryCollection->addAttributeToFilter('url_key', 'pb-category-listing');

foreach ($categoryCollection as $categoryToDelete) {
    try {
        $categoryRepository->delete($categoryToDelete);
    } catch (NoSuchEntityException $exception) {
        continue;
    }
}

$registry->unregister('isSecureArea');
$registry->register('isSecureArea', false);
