<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog;

use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Catalog\Model\Product\Attribute\Source\Status;
use Magento\Catalog\Model\Product\Visibility;
use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Catalog\Model\ResourceModel\Product\CollectionFactory;
use Magento\CatalogWidget\Model\Rule;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Rule\Model\Condition\Combine;
use Magento\Rule\Model\Condition\Sql\Builder;
use Magento\Widget\Helper\Conditions;
use Zend_Db_Select_Exception;

/**
 * Product totals for Products content type
 *
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
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
     * @var CategoryRepositoryInterface
     */
    private $categoryRepository;

    /**
     * @param CollectionFactory $productCollectionFactory
     * @param Builder $sqlBuilder
     * @param Rule $rule
     * @param Conditions $conditionsHelper
     * @param CategoryRepositoryInterface $categoryRepository
     */
    public function __construct(
        CollectionFactory $productCollectionFactory,
        Builder $sqlBuilder,
        Rule $rule,
        Conditions $conditionsHelper,
        CategoryRepositoryInterface $categoryRepository
    ) {
        $this->productCollectionFactory = $productCollectionFactory;
        $this->sqlBuilder = $sqlBuilder;
        $this->rule = $rule;
        $this->conditionsHelper = $conditionsHelper;
        $this->categoryRepository = $categoryRepository;
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
            if (!empty($condition['attribute'])) {
                if (in_array($condition['attribute'], ['special_from_date', 'special_to_date'])) {
                    $conditions[$key]['value'] = date('Y-m-d H:i:s', strtotime($condition['value']));
                }

                if ($condition['attribute'] == 'category_ids') {
                    $conditions[$key] = $this->updateAnchorCategoryConditions($condition);
                }
            }
        }

        $this->rule->loadPost(['conditions' => $conditions]);
        return $this->rule->getConditions();
    }

    /**
     * Update conditions if the category is an anchor category
     *
     * @param array $condition
     * @return array
     */
    private function updateAnchorCategoryConditions(array $condition): array
    {
        if (array_key_exists('value', $condition)) {
            $categoryId = $condition['value'];

            try {
                $category = $this->categoryRepository->get($categoryId);
            } catch (NoSuchEntityException $e) {
                return $condition;
            }

            if ($category->getIsAnchor() && $category->getChildren(true)) {
                $children = explode(',', $category->getChildren(true));

                $condition['operator'] = "()";
                $condition['value'] = array_merge([$categoryId], $children);
            }
        }

        return $condition;
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

        return [
            'total' => $collection->getSize(),
            'disabled' => $disabledCount,
            'notVisible' => $notVisibleCount,
        ];
    }
}
