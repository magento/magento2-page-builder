<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\Catalog\Model\Product\Attribute;

class RepositoryPlugin
{
    /**
     * @var \Magento\Eav\Api\Data\AttributeExtensionFactory
     */
    private $extensionAttributesFactory;

    /**
     * @param \Magento\Eav\Api\Data\AttributeExtensionFactory $extensionAttributesFactory
     */
    public function __construct(
        \Magento\Eav\Api\Data\AttributeExtensionFactory $extensionAttributesFactory
    ) {
        $this->extensionAttributesFactory = $extensionAttributesFactory;
    }

    /**
     * Process is_pagebuilder_enabled extension attribute
     *
     * @param \Magento\Catalog\Model\Product\Attribute\Repository $subject
     * @param \Magento\Catalog\Api\Data\ProductAttributeInterface $attribute
     * @return void
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function beforeSave(
        \Magento\Catalog\Model\Product\Attribute\Repository $subject,
        \Magento\Catalog\Api\Data\ProductAttributeInterface $attribute
    ) {
        $isPageBuilderEnabled = $attribute->getData('extension_attributes')
            ? $attribute->getData('extension_attributes')->getIsPagebuilderEnabled()
            : 0;
        $attribute->setData('is_pagebuilder_enabled', $isPageBuilderEnabled);
    }

    /**
     * Set 'is_pagebuilder_enabled' extension attribute
     *
     * @param \Magento\Catalog\Model\Product\Attribute\Repository $subject
     * @param \Magento\Catalog\Api\Data\ProductAttributeInterface $result
     * @return \Magento\Catalog\Api\Data\ProductAttributeInterface
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterGet(
        \Magento\Catalog\Model\Product\Attribute\Repository $subject,
        \Magento\Catalog\Api\Data\ProductAttributeInterface $result
    ) {
        $isPageBuilderEnabled = $result->getData('is_pagebuilder_enabled');
        $extensionAttribute = $result->getExtensionAttributes()
            ? $result->getExtensionAttributes()
            : $this->extensionAttributesFactory->create();
        $extensionAttribute->setIsPagebuilderEnabled($isPageBuilderEnabled);
        $result->setExtensionAttributes($extensionAttribute);
        return $result;
    }
}
