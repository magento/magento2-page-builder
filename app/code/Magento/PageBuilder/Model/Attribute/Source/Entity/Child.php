<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Model\Attribute\Source\Entity;

class Child extends \Magento\Eav\Model\Entity\Attribute\Source\AbstractSource
{
    /**
     * @var null|array
     */
    private $options = null;

    /**
     * Return the options available from the source model
     *
     * @return array
     */
    public function getAllOptions()
    {
        if ($this->options === null) {
            $entities = $this->getPossibleEntities();
            $entityValues = [];

            if ($entities) {
                /* @var $entity \Magento\PageBuilder\Model\Entity */
                foreach ($entities as $entity) {
                    $label = ($entity->getTitle() ?
                            $entity->getTitle() : '{no title}') . ' [ID: ' . $entity->getId() . ']';
                    $entityValues[] = ['label' => $label, 'value' => $entity->getId()];
                }
            }

            $this->options = $entityValues;
        }

        return $this->options;
    }

    /**
     * @return array
     */
    public function getOptionArray()
    {
        $options = [];
        foreach ($this->getAllOptions() as $option) {
            $options[$option['value']] = $option['label'];
        }

        return $options;
    }

    /**
     * @param int|string $value
     *
     * @return string|bool
     */
    public function getOptionText($value)
    {
        $options = $this->getAllOptions();
        foreach ($options as $option) {
            if ($option['value'] == $value) {
                return $option['label'];
            }
        }

        return false;
    }

    /**
     * Get the possible entities for the field
     *
     * @return array
     */
    public function getPossibleEntities()
    {
        return [];
    }
}
