<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

use Magento\Catalog\Api\CategoryLinkManagementInterface;
use Magento\Catalog\Model\Product;
use Magento\Catalog\Model\Product\Attribute\Source\Status;
use Magento\Catalog\Model\Product\Visibility;
use Magento\Catalog\Model\ResourceModel\Eav\Attribute;
use Magento\Catalog\Setup\CategorySetup;
use Magento\Eav\Model\Entity;
use Magento\TestFramework\Helper\Bootstrap;

/** @var CategorySetup $installer */
$installer = Bootstrap::getObjectManager()->create(CategorySetup::class);
$attributeSetId = $installer->getAttributeSetId('catalog_product', 'Default');
$entityModel = Bootstrap::getObjectManager()->create(Entity::class);
$entityTypeId = $entityModel->setType(Product::ENTITY)->getTypeId();
$groupId = $installer->getDefaultAttributeGroupId($entityTypeId, $attributeSetId);

/** @var Attribute $attribute */
$attribute = Bootstrap::getObjectManager()->create(Attribute::class);
$attribute->setAttributeCode('fpt_for_all')
    ->setEntityTypeId($entityTypeId)
    ->setAttributeGroupId($groupId)
    ->setAttributeSetId($attributeSetId)
    ->setFrontendLabel('fpt_for_all_front_label')
    ->setFrontendInput('weee')
    ->setIsUserDefined(1)
    ->save();

/** @var Product $product */
$product = Bootstrap::getObjectManager()->create(Product::class);
$product->setTypeId('simple')
    ->setAttributeSetId($attributeSetId)
    ->setStoreId(1)
    ->setWebsiteIds([1])
    ->setVisibility(Visibility::VISIBILITY_BOTH)
    ->setStatus(Status::STATUS_ENABLED)
    ->setStockData(['qty' => 75, 'is_in_stock' => 1, 'manage_stock' => 1])
    ->setName('Simple Product FPT')
    ->setSku('simple-with-fpt')
    ->setPrice(75)
    ->setFptForAll([['website_id' => 0, 'country' => 'US', 'state' => 0, 'price' => 12.70, 'delete' => '']])
    ->save();

/** @var $categoryLinkManagement CategoryLinkManagementInterface */
$categoryLinkManagement = Bootstrap::getObjectManager()->create(CategoryLinkManagementInterface::class);
$categoryLinkManagement->assignProductToCategories(
    $product->getSku(),
    [2]
);
