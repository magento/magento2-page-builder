<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Setup\DataConverter;

use Magento\PageBuilderDataMigration\Model\EntityFactory;
use Magento\PageBuilderDataMigration\Model\AttributeFactory;
use Magento\Framework\Exception\NoSuchEntityException;

/**
 * Class ConfigurableEavAttributeLoader
 *
 * Using dependency injection, a virtual type can extend this class and be used by your renderer, to configure
 * additional attributes that you want to extract from the EAV during hydration.
 *
 * @see \Magento\PageBuilderDataMigration\Setup\DataConverter\Renderer\Heading for example of configuration
 */
class ConfigurableEavAttributeLoader implements EavAttributeLoaderInterface
{
    /**
     * @var EntityFactory
     */
    private $entityFactory;

    /**
     * @var string[]
     */
    private $eavAttributeNames = ['css_classes'];

    /**
     * @var AttributeFactory
     */
    private $attributeFactory;

    /**
     * @param EntityFactory $entityFactory
     * @param AttributeFactory $attributeFactory
     * @param array $additionalEavAttributes
     */
    public function __construct(
        EntityFactory $entityFactory,
        AttributeFactory $attributeFactory,
        array $additionalEavAttributes = []
    ) {
        $this->entityFactory = $entityFactory;
        $this->attributeFactory = $attributeFactory;
        $this->eavAttributeNames = array_merge(
            $this->eavAttributeNames,
            $additionalEavAttributes
        );
    }

    /**
     * @inheritdoc
     *
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function load($entityId) : array
    {
        $eavData = [];
        $entity = $this->entityFactory->create();
        $entity->load($entityId);
        if (!$entity->getId()) {
            throw new NoSuchEntityException(__('Entity with id "%1" does not exist.', $entityId));
        }
        foreach ($this->eavAttributeNames as $attributeName) {
            if ($entity->hasData($attributeName)) {
                $eavData[$attributeName] = $entity->getDataByKey($attributeName);

                // Replace source model values with labels
                $attribute = $this->attributeFactory->create()
                    ->loadByCode('gene_bluefoot_entity', $attributeName);
                $attribute->loadByCode('gene_bluefoot_entity', $attributeName);
                if ($attribute->usesSource()) {
                    foreach ($attribute->getOptions() as $sourceOption) {
                        if ($sourceOption->getValue() === $eavData[$attributeName]) {
                            $eavData[$attributeName] = $sourceOption->getLabel();
                            break;
                        }
                    }
                }
            }
        }

        return $eavData;
    }
}
