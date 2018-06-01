<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\TestModulePageBuilderDataMigration\Model;

use Magento\TestModulePageBuilderDataMigration\Setup\EntitySetupFactory;

class Install extends \Magento\Framework\Model\AbstractModel
{
    /**
     * @var null|array
     */
    private $installData;

    /**
     * @var \Magento\TestModulePageBuilderDataMigration\Model\Install\Attribute
     */
    private $attributeInstall;

    /**
     * @var \Magento\TestModulePageBuilderDataMigration\Model\Install\ContentType
     */
    private $contentTypeInstall;

    /**
     * @var \Magento\TestModulePageBuilderDataMigration\Setup\EntitySetupFactory
     */
    private $entitySetupFactory;

    /**
     * Constructor
     *
     * @param \Magento\Framework\Model\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param \Magento\TestModulePageBuilderDataMigration\Model\Install\Attribute $attribute
     * @param \Magento\TestModulePageBuilderDataMigration\Model\Install\ContentType $contentType
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null $resourceCollection
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        Install\Attribute $attribute,
        Install\ContentType $contentType,
        EntitySetupFactory $entitySetupFactory,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);

        $this->attributeInstall = $attribute;
        $this->contentTypeInstall = $contentType;
        $this->entitySetupFactory = $entitySetupFactory;
    }

    /**
     * Install data from a data set
     *
     * @param $data array
     * @return bool
     * @throws \Exception
     */
    public function install($data, $setup)
    {
        if (!is_array($data)) {
            throw new \Exception('Data must be a valid array');
        }

        $this->installData = $data;
        $eavSetup = $this->entitySetupFactory->create(['setup' => $setup]);

        // Install the attributes first
        if ($this->hasAttributes()) {
            $this->attributeInstall->createAttributes($this->getAttributes(), $data, $eavSetup);
        }

        // Then any content types
        if ($this->hasContentTypes()) {
            $this->contentTypeInstall->createContentTypes($this->getContentTypes(), $data, $eavSetup);
        }

        // Resolve any unmapped additional data
        $this->attributeInstall->resolveAdditionalData($eavSetup);

        return true;
    }

    /**
     * Does the data contain attributes?
     *
     * @return bool
     */
    protected function hasAttributes()
    {
        return array_key_exists('attributes', $this->installData);
    }

    /**
     * Retrieve the attributes
     *
     * @return mixed
     */
    protected function getAttributes()
    {
        return $this->installData['attributes'];
    }

    /**
     * Does the data contain content types?
     *
     * @return bool
     */
    protected function hasContentTypes()
    {
        return array_key_exists('content_types', $this->installData);
    }

    /**
     * Retrieve the content types
     *
     * @return mixed
     */
    protected function getContentTypes()
    {
        return $this->installData['content_types'];
    }
}
