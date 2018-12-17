<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\CatalogWidget\Block\Product;

/**
 * Plugin to inject catalog/search visibility attribute constraint into conditions,
 * as visibility is normally queried against a store-specific index, and the goal is to allow for store-agnostic
 * list of products.
 * @see \Magento\PageBuilder\Ui\DataProvider\Product\ProductCollection
 */
class ProductsListPlugin
{
    /**
     * @var bool
     */
    private $shouldIncludeAllWebstoreViews = false;

    /**
     * @var \Magento\Widget\Helper\Conditions
     */
    private $conditionsHelper;

    public function __construct(
        \Magento\Widget\Helper\Conditions $conditionsHelper
    ) {
        $this->conditionsHelper = $conditionsHelper;
    }

    /**
     * Determine whether it is necessary to include all webstore views for curating the list (i.e. store_id === 0)
     *
     * @param \Magento\Framework\View\Element\Template $subject
     */
    public function beforeCreateCollection(
        \Magento\Framework\View\Element\Template $subject
    ) {
        $store_id = $subject->getData('store_id');
        $this->shouldIncludeAllWebstoreViews = $store_id !== null && (int) $store_id === 0;
    }

    /**
     * Inject visibility attribute query condition and set new data on conditions_encoded
     *
     * @param \Magento\CatalogWidget\Block\Product\ProductsList $subject
     * @param callable $proceed
     * @param string $key
     * @param string|int $index
     * @return mixed - the value of calling $this->getData($key, $index)
     */
    public function aroundGetData(
        \Magento\CatalogWidget\Block\Product\ProductsList $subject,
        callable $proceed,
        $key = '',
        $index = null
    ) {
        static $hasAlreadyAppliedVisibilityCondition = false;

        if ($key !== 'conditions_encoded' ||
            !$this->shouldIncludeAllWebstoreViews ||
            $hasAlreadyAppliedVisibilityCondition
        ) {
            return $proceed($key, $index);
        }

        $conditionsEncoded = $subject->getData()['conditions_encoded'] ?? null;

        if (!$conditionsEncoded) {
            return $proceed($key, $index);
        }

        $conditions = $this->conditionsHelper->decode($conditionsEncoded);

        $nextHighestRootConditionNumber = max(
            0,
            ...preg_grep('#^\d+$#', array_keys($conditions))
        ) + 1;

        $conditions[$nextHighestRootConditionNumber] = [
            'type' => \Magento\CatalogWidget\Model\Rule\Condition\Combine::class,
            'aggregator' => 'all',
            'value' => '1',
            'new_child' => '',
        ];

        $conditions["$nextHighestRootConditionNumber--1"] = [
            'type' => \Magento\CatalogWidget\Model\Rule\Condition\Product::class,
            'attribute' => 'visibility',
            'operator' => '==',
            'value' => (string) \Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH
        ];

        $subject->setData('conditions_encoded', $this->conditionsHelper->encode($conditions));

        $hasAlreadyAppliedVisibilityCondition = true;

        return $proceed($key, $index);
    }
}
