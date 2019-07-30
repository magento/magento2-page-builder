<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog;

/**
 * Sorting of Catalog Widget Products
 *
 * @package Magento\PageBuilder\Model
 */
class Sorting
{
    /**
     * @var array
     */
    protected $sortClasses = [
        'default' => Sorting\DefaultSorting::class
    ];

    /**
     * @var Sorting\Factory
     */
    protected $factory;

    /**
     * @var array
     */
    protected $sortInstances = [];

    /**
     * Sorting constructor.
     * @param Sorting\Factory $factory
     * @param array $sortClasses
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function __construct(
        Sorting\Factory $factory,
        array $sortClasses
    ) {
        $this->sortClasses = array_merge($this->sortClasses, $sortClasses);
        $this->factory = $factory;
        foreach ($this->sortClasses as $key => $className) {
            $this->sortInstances[$key] = $this->factory->create($className);
        }
    }

    /**
     * Sorting options array
     *
     * @return array
     */
    public function getSortingOptions(): array
    {
        $options = [];
        foreach ($this->sortInstances as $key => $instance) {
            $options[$key] = $instance->getLabel();
        }
        return $options;
    }

    /**
     * Get the instance of the first option which is None
     *
     * @param string $sortOption
     * @return Sorting\SortInterface|null
     */
    public function getSortingInstance($sortOption): Sorting\SortInterface
    {
        if (isset($this->sortInstances[$sortOption])) {
            return $this->sortInstances[$sortOption];
        }
        return $this->sortInstances['default'];
    }

    /**
     * Applying sorting option
     *
     * @param string $option
     * @param \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
     * @return \Magento\Catalog\Model\ResourceModel\Product\Collection
     */
    public function applySorting(
        string $option,
        \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
    ): \Magento\Catalog\Model\ResourceModel\Product\Collection {
        $sortBuilder = $this->getSortingInstance($option);
        $_collection = $sortBuilder->sort($collection);

        if ($_collection->isLoaded()) {
            $_collection->clear();
        }

        return $_collection;
    }
}
