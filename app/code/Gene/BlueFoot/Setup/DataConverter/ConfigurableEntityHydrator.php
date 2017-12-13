<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

use Gene\BlueFoot\Model\EntityRepository;

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
     * @param array $data
     * @return array
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
