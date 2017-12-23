<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

use Gene\BlueFoot\Model\EntityRepository;
use Gene\BlueFoot\Model\AttributeFactory;

/**
 * Using dependency injection, a virtual type can extend this class and be used by your renderer, to configure
 * additional attributes that you want to extract from the EAV during hydration.
 *
 * @see \Gene\BlueFoot\Setup\DataConverter\Renderer\Heading for example of configuration
 */
class ConfigurableEavAttributeLoader implements EavAttributeLoaderInterface
{
    /**
     * @var EntityRepository
     */
    private $entityRepository;

    /**
     * @var string[]
     */
    private $eavAttributeNames = ['css_classes'];

    /**
     * @var AttributeFactory
     */
    private $attributeFactory;

    public function __construct(
        EntityRepository $entityRepository,
        AttributeFactory $attributeFactory,
        array $additionalEavAttributes = []
    ) {
        $this->entityRepository = $entityRepository;
        $this->attributeFactory = $attributeFactory;
        $this->eavAttributeNames = array_merge(
            $this->eavAttributeNames,
            $additionalEavAttributes
        );
    }

    /**
     * @inheritdoc
     */
    public function load($entityId)
    {
        $eavData = [];
        $entity = $this->entityRepository->getById($entityId);
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
