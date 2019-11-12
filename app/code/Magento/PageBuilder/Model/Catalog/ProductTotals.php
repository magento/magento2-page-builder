<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog;

use Magento\Catalog\Model\Product\Attribute\Source\Status;
use Magento\Catalog\Model\Product\Visibility;
use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Catalog\Model\ResourceModel\Product\CollectionFactory;
use Magento\CatalogInventory\Helper\Stock;
use Magento\CatalogWidget\Model\Rule;
use Magento\Framework\Exception\LocalizedException;
use Magento\Rule\Model\Condition\Combine;
use Magento\Rule\Model\Condition\Sql\Builder;
use Magento\Widget\Helper\Conditions;
use Zend_Db_Select_Exception;

/**
 * Product totals for Products content type
 */
class ProductTotals
{
    /**
     * @var CollectionFactory
     */
    private $productCollectionFactory;

    /**
     * @var Builder
     */
    private $sqlBuilder;

    /**
     * @var Rule
     */
    private $rule;

    /**
     * @var Conditions
     */
    private $conditionsHelper;

    /**
     * @var Stock
     */
    private $stockFilter;

    /**
     * @param CollectionFactory $productCollectionFactory
     * @param Builder $sqlBuilder
     * @param Rule $rule
     * @param Conditions $conditionsHelper
     * @param Stock $stockFilter
     */
    public function __construct(
        CollectionFactory $productCollectionFactory,
        Builder $sqlBuilder,
        Rule $rule,
        Conditions $conditionsHelper,
        Stock $stockFilter
    ) {
        $this->productCollectionFactory = $productCollectionFactory;
        $this->sqlBuilder = $sqlBuilder;
        $this->rule = $rule;
        $this->conditionsHelper = $conditionsHelper;
        $this->stockFilter = $stockFilter;
    }

    /**
     * Decode the provided conditions
     *
     * @param string $conditions
     * @return Combine
     */
    private function decodeConditions(string $conditions): Combine
    {
        if ($conditions) {
            $conditions = $this->conditionsHelper->decode($conditions);
        }

        foreach ($conditions as $key => $condition) {
            if (!empty($condition['attribute'])
                && in_array($condition['attribute'], ['special_from_date', 'special_to_date'])
            ) {
                $conditions[$key]['value'] = date('Y-m-d H:i:s', strtotime($condition['value']));
            }
        }

        $this->rule->loadPost(['conditions' => $conditions]);
        return $this->rule->getConditions();
    }

    /**
     * Retrieve product collection based on provided conditions
     *
     * @param string $conditions
     * @return Collection
     * @throws LocalizedException
     */
    private function getProductCollection(string $conditions): Collection
    {
        /** @var $collection Collection */
        $collection = $this->productCollectionFactory->create();

        /** @var Combine $collectionConditions */
        $collectionConditions = $this->decodeConditions($conditions);
        $collectionConditions->collectValidatedAttributes($collection);
        $this->sqlBuilder->attachConditionToCollection($collection, $collectionConditions);

        /**
         * Prevent retrieval of duplicate records. This may occur when multiselect product attribute matches
         * several allowed values from condition simultaneously
         */
        $collection->distinct(true);

        return $collection;
    }

    /**
     * Retrieve count of all disabled products
     *
     * @param Collection $baseCollection
     * @return int number of disabled products
     */
    private function getDisabledCount(Collection $baseCollection): int
    {
        /** @var Collection $disabledCollection */
        $disabledCollection = clone $baseCollection;
        $disabledCollection->addAttributeToFilter('status', Status::STATUS_DISABLED);
        return $disabledCollection->getSize();
    }

    /**
     * Retrieve count of all not visible individually products
     *
     * @param Collection $baseCollection
     * @return int number of products not visible individually
     */
    private function getNotVisibleCount(Collection $baseCollection): int
    {
        $notVisibleCollection = clone $baseCollection;
        $notVisibleCollection->addAttributeToFilter('status', Status::STATUS_ENABLED);
        $notVisibleCollection->addAttributeToFilter(
            'visibility',
            [
                Visibility::VISIBILITY_NOT_VISIBLE,
                Visibility::VISIBILITY_IN_SEARCH
            ]
        );
        return $notVisibleCollection->getSize();
    }

    /**
     * Retrieve count of all out of stock products
     *
     * @param Collection $baseCollection
     * @return int number of out of stock products
     * @throws Zend_Db_Select_Exception
     */
    private function getOutOfStockCount(Collection $baseCollection): int
    {
        // Retrieve in stock products, then subtract them from the total
        $outOfStockCollection = clone $baseCollection;
        $this->stockFilter->addIsInStockFilterToCollection($outOfStockCollection);
        // Remove existing stock_status where condition from query
        $outOfStockWhere = $outOfStockCollection->getSelect()->getPart('where');
        $outOfStockWhere = array_filter(
            $outOfStockWhere,
            function ($whereCondition) {
                return !stristr($whereCondition, 'stock_status');
            }
        );
        $outOfStockCollection->getSelect()->setPart('where', $outOfStockWhere);
        $outOfStockCollection->getSelect()->where(
            'stock_status_index.stock_status = ?',
            \Magento\CatalogInventory\Model\Stock\Status::STATUS_OUT_OF_STOCK
        );
        return $outOfStockCollection->getSize();
    }

    /**
     * Retrieve product totals for collection
     *
     * @param string $conditions
     * @return array
     * @throws LocalizedException
     * @throws Zend_Db_Select_Exception
     */
    public function getProductTotals(string $conditions): array
    {
        /** @var Collection $collection */
        $collection = $this->getProductCollection($conditions);

        // Exclude any linked products, e.g. simple products assigned to a configurable, bundle or group
        $collection->getSelect()->joinLeft(
            ['super_link_table' => $collection->getTable('catalog_product_super_link')],
            'super_link_table.product_id = e.entity_id',
            ['product_id']
        )->joinLeft(
            ['link_table' => $collection->getTable('catalog_product_link')],
            'link_table.product_id = e.entity_id',
            ['product_id']
        )->where('link_table.product_id IS NULL OR super_link_table.product_id IS NULL');

        $disabledCount = $this->getDisabledCount($collection);
        $notVisibleCount = $this->getNotVisibleCount($collection);
        $outOfStockCount = $this->getOutOfStockCount($collection);

        return [
            'total' => $collection->getSize(),
            'disabled' => $disabledCount,
            'notVisible' => $notVisibleCount,
            'outOfStock' => $outOfStockCount,
        ];
    }
}
