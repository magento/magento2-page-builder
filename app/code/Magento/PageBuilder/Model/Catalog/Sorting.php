<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog;

/**
 * Sorting of Catalog Widget Products
 */
class Sorting
{
    /**
     * @var array
     */
    private $sortClasses;

    /**
     * @var Sorting\Factory
     */
    private $factory;

    /**
     * @var Sorting\OptionInterface[]
     */
    private $sortInstances = [];

    /**
     * @param Sorting\Factory $factory
     * @param array $sortClasses
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function __construct(
        Sorting\Factory $factory,
        array $sortClasses
    ) {
        $this->sortClasses = $sortClasses;
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
     * @return Sorting\OptionInterface|null
     */
    public function getSortingInstance($sortOption): ?Sorting\OptionInterface
    {
        if (isset($this->sortInstances[$sortOption])) {
            return $this->sortInstances[$sortOption];
        }

        return null;
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
        if ($sortBuilder) {
            $collection = $sortBuilder->sort($collection);
        }

        if ($collection->isLoaded()) {
            $collection->clear();
        }

        return $collection;
    }
}
