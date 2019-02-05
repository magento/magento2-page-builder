<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\TestModulePageBuilderDataMigration\Model\Attribute;

use Magento\Framework\Api\AttributeValueFactory;

class ContentType extends \Magento\Eav\Model\Entity\Attribute\Set
{
    const AREA_FRONTEND = 'frontend';
    const AREA_ADMINHTML = 'adminhtml';

    /**
     * @var \Magento\PageBuilderDataMigration\Model\ResourceModel\EntityFactory
     */
    private $entityFactory;

    /**
     * Constructor
     *
     * @param \Magento\Framework\Model\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param \Magento\Framework\Api\ExtensionAttributesFactory $extensionFactory
     * @param AttributeValueFactory $customAttributeFactory
     * @param \Magento\Eav\Model\Config $eavConfig
     * @param \Magento\Eav\Model\Entity\Attribute\GroupFactory $attrGroupFactory
     * @param \Magento\Eav\Model\Entity\AttributeFactory $attributeFactory
     * @param \Magento\Eav\Model\ResourceModel\Entity\Attribute $resourceAttribute
     * @param \Magento\PageBuilderDataMigration\Model\ResourceModel\EntityFactory $entityFactory
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null $resourceCollection
     * @param array $data
     *
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Api\ExtensionAttributesFactory $extensionFactory,
        AttributeValueFactory $customAttributeFactory,
        \Magento\Eav\Model\Config $eavConfig,
        \Magento\Eav\Model\Entity\Attribute\GroupFactory $attrGroupFactory,
        \Magento\Eav\Model\Entity\AttributeFactory $attributeFactory,
        \Magento\Eav\Model\ResourceModel\Entity\Attribute $resourceAttribute,
        \Magento\PageBuilderDataMigration\Model\ResourceModel\EntityFactory $entityFactory,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct(
            $context,
            $registry,
            $extensionFactory,
            $customAttributeFactory,
            $eavConfig,
            $attrGroupFactory,
            $attributeFactory,
            $resourceAttribute,
            $resource,
            $resourceCollection,
            $data
        );

        $this->entityFactory = $entityFactory;
    }

    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('Magento\TestModulePageBuilderDataMigration\Model\ResourceModel\Attribute\ContentType');
    }

    /**
     * Return all the attributes associated with this content type
     *
     * @return array|null
     */
    public function getAllAttributes()
    {
        if ($this->getId()) {
            $entityResource = $this->entityFactory->create();
            return $entityResource->loadAllAttributes()
                ->getSortedAttributes($this->getId());
        }

        return null;
    }
}
