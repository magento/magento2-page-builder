<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\Form\Element;

use Magento\Catalog\Model\Product\Attribute\Source\Status;
use Magento\Catalog\Model\Product\Visibility;
use Magento\Framework\App\Action\HttpPostActionInterface;

/**
 * Returns the number of products that match the provided conditions
 */
class ProductTotals extends \Magento\Backend\App\Action implements HttpPostActionInterface
{
    const ADMIN_RESOURCE = 'Magento_Catalog::products';

    /**
     * Product collection factory
     *
     * @var \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory
     */
    private $productCollectionFactory;

    /**
     * @var \Magento\Rule\Model\Condition\Sql\Builder
     */
    private $sqlBuilder;

    /**
     * @var \Magento\CatalogWidget\Model\Rule
     */
    private $rule;

    /**
     * @var \Magento\Widget\Helper\Conditions
     */
    private $conditionsHelper;

    /**
     * @var \Magento\Catalog\Api\\CategoryRepositoryInterface
     */
    private $categoryRepository;

    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    private $jsonFactory;

    /**
     * @var \Magento\CatalogInventory\Helper\Stock
     */
    private $stockFilter;

    /**
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory $productCollectionFactory
     * @param \Magento\Rule\Model\Condition\Sql\Builder $sqlBuilder
     * @param \Magento\CatalogWidget\Model\Rule $rule
     * @param \Magento\Widget\Helper\Conditions $conditionsHelper
     * @param \Magento\Catalog\Api\CategoryRepositoryInterface $categoryRepository
     * @param \Magento\Framework\Controller\Result\JsonFactory $jsonFactory
     * @param \Magento\CatalogInventory\Helper\Stock $stockFilter
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory $productCollectionFactory,
        \Magento\Rule\Model\Condition\Sql\Builder $sqlBuilder,
        \Magento\CatalogWidget\Model\Rule $rule,
        \Magento\Widget\Helper\Conditions $conditionsHelper,
        \Magento\Catalog\Api\CategoryRepositoryInterface $categoryRepository,
        \Magento\Framework\Controller\Result\JsonFactory $jsonFactory,
        \Magento\CatalogInventory\Helper\Stock $stockFilter
    ) {
        $this->productCollectionFactory = $productCollectionFactory;
        $this->sqlBuilder = $sqlBuilder;
        $this->rule = $rule;
        $this->conditionsHelper = $conditionsHelper;
        $this->categoryRepository = $categoryRepository;
        $this->jsonFactory = $jsonFactory;
        $this->stockFilter = $stockFilter;
        parent::__construct($context);
    }

    /**
     * Get conditions
     *
     * @return \Magento\Rule\Model\Condition\Combine
     */
    private function getConditions()
    {
        $conditions = $this->getRequest()->getParam('conditionValue');

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
     * Prepare and return product collection
     *
     * @return Collection
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    private function createCollection()
    {
        /** @var $collection Collection */
        $collection = $this->productCollectionFactory->create();

        /** @var \Magento\Rule\Model\Condition\Combine $conditions */
        $conditions = $this->getConditions();
        $conditions->collectValidatedAttributes($collection);
        $this->sqlBuilder->attachConditionToCollection($collection, $conditions);

        /**
         * Prevent retrieval of duplicate records. This may occur when multiselect product attribute matches
         * several allowed values from condition simultaneously
         */
        $collection->distinct(true);

        return $collection;
    }

    /**
     * @inheritdoc
     */
    public function execute()
    {
        /** @var \Magento\Catalog\Model\ResourceModel\Product\Collection $collection */
        $collection = $this->createCollection();

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

        // Retrieve all disabled products
        $disabledCollection = clone $collection;
        $disabledCollection->addAttributeToFilter('status', Status::STATUS_DISABLED);

        // Retrieve all not visible individually products
        $notVisibleCollection = clone $collection;
        $notVisibleCollection->addAttributeToFilter(
            'visibility',
            [
                Visibility::VISIBILITY_NOT_VISIBLE,
                Visibility::VISIBILITY_IN_SEARCH
            ]
        );

        // Retrieve in stock products, then subtract them from the total
        $outOfStockCollection = clone $collection;
        $this->stockFilter->addIsInStockFilterToCollection($outOfStockCollection);
        // Remove existing stock_status where condition from query
        $outOfStockWhere = $outOfStockCollection->getSelect()->getPart(\Magento\Framework\DB\Select::WHERE);
        $outOfStockWhere = array_filter(
            $outOfStockWhere,
            function ($whereCondition) {
                return !stristr($whereCondition, 'stock_status');
            }
        );
        $outOfStockCollection->getSelect()->setPart(\Magento\Framework\DB\Select::WHERE, $outOfStockWhere);
        $outOfStockCollection->getSelect()->where(
            'stock_status_index.stock_status = ?',
            \Magento\CatalogInventory\Model\Stock\Status::STATUS_OUT_OF_STOCK
        );

        return $this->jsonFactory->create()
            ->setData(
                [
                    'total' => $collection->getSize(),
                    'disabled' => $disabledCollection->getSize(),
                    'notVisible' => $notVisibleCollection->getSize(),
                    'outOfStock' => $outOfStockCollection->getSize(),
                ]
            );
    }
}
