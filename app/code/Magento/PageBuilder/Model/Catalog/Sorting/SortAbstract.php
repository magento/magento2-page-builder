<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog\Sorting;

use Magento\Catalog\Model\Indexer\Product\Price\DimensionCollectionFactory;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\Indexer\ScopeResolver\IndexScopeResolver;
use Magento\Customer\Model\Indexer\CustomerGroupDimensionProvider;
use Magento\Framework\Indexer\DimensionFactory;

/**
 * Class SortAbstract
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting
 */
class SortAbstract
{
    /**
     * @var \Magento\Framework\Module\Manager
     */
    protected $moduleManager;

    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    protected $scopeConfig;

    /**
     * @var DimensionCollectionFactory
     */
    private $dimensionCollectionFactory;

    /**
     * @var IndexScopeResolver
     */
    private $indexScopeResolver;

    /**
     * @var DimensionFactory|null
     */
    private $dimensionFactory;

    /**
     * @param \Magento\Framework\Module\Manager $moduleManager
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
     * @param DimensionCollectionFactory|null $dimensionCollectionFactory
     * @param IndexScopeResolver|null $indexScopeResolver
     * @param DimensionFactory|null $dimensionFactory
     */
    public function __construct(
        \Magento\Framework\Module\Manager $moduleManager,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        DimensionCollectionFactory $dimensionCollectionFactory = null,
        IndexScopeResolver $indexScopeResolver = null,
        DimensionFactory $dimensionFactory = null
    ) {
        $this->moduleManager = $moduleManager;
        $this->scopeConfig = $scopeConfig;
        $this->dimensionCollectionFactory = $dimensionCollectionFactory
            ?: ObjectManager::getInstance()->get(DimensionCollectionFactory::class);
        $this->indexScopeResolver = $indexScopeResolver
            ?: ObjectManager::getInstance()->get(IndexScopeResolver::class);
        $this->dimensionFactory = $dimensionFactory
            ?: ObjectManager::getInstance()->get(DimensionFactory::class);
    }

    /**
     * Stock ID
     *
     * @return int
     */
    protected function getStockId(): int
    {
        return \Magento\CatalogInventory\Model\Stock::DEFAULT_STOCK_ID;
    }

    /**
     * Sorting ascending order
     *
     * @return string
     */
    protected function ascOrder(): string
    {
        return \Magento\Framework\DB\Select::SQL_ASC;
    }

    /**
     * Sorting descending order
     *
     * @return string
     */
    protected function descOrder(): string
    {
        return \Magento\Framework\DB\Select::SQL_DESC;
    }

    /**
     * Adding price information
     *
     * @param \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
     * @return void
     */
    protected function addPriceData($collection): void
    {
        $connection = $collection->getConnection();
        $select = $collection->getSelect();
        $joinCond = join(
            ' AND ',
            ['price_index.entity_id = e.entity_id']
        );
        $select->where('customer_group_id = ?', 0);

        $fromPart = $select->getPart(\Magento\Framework\DB\Select::FROM);

        if (!isset($fromPart['price_index'])) {
            $least = $connection->getLeastSql(['price_index.min_price', 'price_index.tier_price']);
            $minimalExpr = $connection->getCheckSql(
                'price_index.tier_price IS NOT NULL',
                $least,
                'price_index.min_price'
            );
            $specialCheck = $connection->getCheckSql(
                'price_index.price <> price_index.final_price',
                1,
                0
            );
            $colls = [
                'price',
                'tax_class_id',
                'final_price',
                'min_price',
                'max_price',
                'tier_price',
                'special_price' => $specialCheck,
                'minimal_price' => $minimalExpr,
            ];

            $where = str_replace('`e`.', '', $select->getPart('where')[0]);

            $selects = [];
            $dimensionsCollection = iterator_to_array($this->dimensionCollectionFactory->create());
            foreach ($dimensionsCollection as $dimensions) {
                $unionSelect = clone $connection->select();
                if (array_key_exists(CustomerGroupDimensionProvider::DIMENSION_NAME, $dimensions)) {
                    $dimensions[CustomerGroupDimensionProvider::DIMENSION_NAME]
                        = $this->dimensionFactory->create(CustomerGroupDimensionProvider::DIMENSION_NAME, 0);
                }
                $tableName = $this->indexScopeResolver->resolve('catalog_product_index_price', $dimensions);
                $selects[] = $unionSelect->from($tableName)->where($where);
            }
            $selects = array_unique($selects);
            $unionPrice = $connection->select()->union($selects);
            $select->joinLeft(
                ['price_index' => $unionPrice],
                'price_index.entity_id = e.entity_id',
                $colls
            );
        } else {
            $fromPart['price_index']['joinCondition'] = $joinCond;
            $select->setPart(\Magento\Framework\DB\Select::FROM, $fromPart);
        }
    }
}
