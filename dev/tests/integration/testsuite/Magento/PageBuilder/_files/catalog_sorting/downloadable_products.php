<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

use Magento\Catalog\Api\CategoryLinkManagementInterface;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\Product;
use Magento\Catalog\Model\Product\Attribute\Source\Status;
use Magento\Catalog\Model\Product\Visibility;
use Magento\Downloadable\Api\Data\LinkInterfaceFactory;
use Magento\Downloadable\Api\DomainManagerInterface;
use Magento\Downloadable\Helper\Download;
use Magento\Downloadable\Model\Link;
use Magento\Downloadable\Model\Product\Type;
use Magento\TestFramework\Helper\Bootstrap;

$objectManager = Bootstrap::getObjectManager();

/** @var $categoryLinkManagement CategoryLinkManagementInterface */
$categoryLinkManagement = $objectManager->create(CategoryLinkManagementInterface::class);

/** @var DomainManagerInterface $domainManager */
$domainManager = $objectManager->get(DomainManagerInterface::class);
$domainManager->addDomains(
    [
        'example.com',
        'www.example.com',
        'www.sample.example.com',
        'google.com'
    ]
);

/** @var Product $product */
$product = $objectManager->create(Product::class);
$product
    ->setTypeId(Type::TYPE_DOWNLOADABLE)
    ->setAttributeSetId(4)
    ->setWebsiteIds([1])
    ->setName('Downloadable Product with product price')
    ->setSku('downloadable-product-price-on-product')
    ->setPrice(41)
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED)
    ->setLinksPurchasedSeparately(true)
    ->setStockData(
        [
            'qty' => 41,
            'is_in_stock' => 1,
            'manage_stock' => 1,
        ]
    );

/**
 * @var LinkInterfaceFactory $linkFactory
 */
$linkFactory = $objectManager->get(LinkInterfaceFactory::class);
$links = [];
$linkData = [
    'title' => 'Downloadable Product Link',
    'type' => Download::LINK_TYPE_URL,
    'is_shareable' => Link::LINK_SHAREABLE_CONFIG,
    'link_url' => 'http://example.com/downloadable.txt',
    'link_id' => 0,
    'is_delete' => null,
];
$link = $linkFactory->create(['data' => $linkData]);
$link->setId(null);
$link->setLinkType($linkData['type']);
$link->setStoreId($product->getStoreId());
$link->setWebsiteId($product->getStore()->getWebsiteId());
$link->setProductWebsiteIds($product->getWebsiteIds());
$link->setSortOrder(1);
$link->setPrice(0);
$link->setNumberOfDownloads(0);
$links[] = $link;
$extension = $product->getExtensionAttributes();
$extension->setDownloadableProductLinks($links);
$product->setExtensionAttributes($extension);

$productRepository = $objectManager->get(ProductRepositoryInterface::class);
$productRepository->save($product);
$categoryLinkManagement->assignProductToCategories(
    $product->getSku(),
    [2]
);


$product = $objectManager->create(Product::class);
$product
    ->setTypeId(Type::TYPE_DOWNLOADABLE)
    ->setAttributeSetId(4)
    ->setWebsiteIds([1])
    ->setName('Downloadable Product with link price')
    ->setSku('downloadable-product-price-on-link')
    ->setPrice(0)
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED)
    ->setLinksPurchasedSeparately(true)
    ->setStockData(
        [
            'qty' => 42,
            'is_in_stock' => 1,
            'manage_stock' => 1,
        ]
    );

$links = [];
$linkData = [
    'title' => 'Downloadable Product Link 2',
    'type' => \Magento\Downloadable\Helper\Download::LINK_TYPE_URL,
    'is_shareable' => \Magento\Downloadable\Model\Link::LINK_SHAREABLE_CONFIG,
    'link_url' => 'http://example.com/downloadable2.txt',
    'link_id' => 0,
    'is_delete' => null,
];
$link = $linkFactory->create(['data' => $linkData]);
$link->setId(null);
$link->setLinkType($linkData['type']);
$link->setStoreId($product->getStoreId());
$link->setWebsiteId($product->getStore()->getWebsiteId());
$link->setProductWebsiteIds($product->getWebsiteIds());
$link->setSortOrder(1);
$link->setPrice(42);
$link->setNumberOfDownloads(0);
$links[] = $link;
$extension = $product->getExtensionAttributes();
$extension->setDownloadableProductLinks($links);
$product->setExtensionAttributes($extension);
$productRepository->save($product);
$categoryLinkManagement->assignProductToCategories(
    $product->getSku(),
    [2]
);
