<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

use Gene\BlueFoot\Model\EntityRepository;

/**
 * Class ConfigurableEntityHydrator
 *
 * Using dependency injection, a virtual type can extend this class and be used by your renderer, to configure
 * additional attributes that you want to extract from the EAV during hydration.
 *
 * @see \Gene\BlueFoot\Setup\DataConverter\Renderer\Heading for example of configuration
 */
class ConfigurableEntityHydrator implements EntityHydratorInterface
{
    private $entityRepository;

    private $eavAttributeNames = ['css_classes'];

    public function __construct(EntityRepository $entityRepository, array $additionalEavAttributes = [])
    {
        $this->entityRepository = $entityRepository;
        $this->eavAttributeNames = array_merge($this->eavAttributeNames, $additionalEavAttributes);
    }

    /**
     * @inheritdoc
     */
    public function hydrate(array $data)
    {
        $eavData = [];
        if (isset($data['entityId'])) {
            $entity = $this->entityRepository->getById($data['entityId']);
            foreach ($this->eavAttributeNames as $attributeName) {
                if ($entity->hasData($attributeName)) {
                    $eavData[$attributeName] = $entity->getDataByKey($attributeName);
                }
            }
        }

        return $eavData;
    }
}
