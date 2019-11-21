<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog;

use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Catalog\Model\ResourceModel\Product\CollectionFactory;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Indexer\Model\Indexer;
use Magento\TestFramework\Helper\Bootstrap;
use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\CatalogWidget\Block\Product\ProductsList;

/**
 * Class SortingTest
 */
class SortingTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var CollectionFactory
     */
    private $productCollectionFactory;

    /**
     * @var Sorting
     */
    private $sortModel;

    /**
     * @var CategoryRepositoryInterface
     */
    private $categoryRepository;

    /**
     * @var Indexer
     */
    protected $indexer;

    /**
     * @var int
     */
    private $categoryId = 333;

    /**
     * @var ProductsList
     */
    private $productList;

    /**
     * Set up instances and mock objects
     */
    protected function setUp()
    {
        $objectManager = Bootstrap::getObjectManager();
        $this->productCollectionFactory = $objectManager->create(
            CollectionFactory::class
        );
        $this->sortModel = $objectManager->create(Sorting::class);
        $this->categoryRepository = $objectManager->create(
            CategoryRepositoryInterface::class
        );

        $this->productList = $objectManager->create(ProductsList::class);
    }

    /**
     * @param array $productSortData
     * @dataProvider productSortDataProvider1
     * @dataProvider productSortDataProvider2
     * @dataProvider productSortDataProvider3
     * @magentoDataFixture Magento/PageBuilder/_files/catalog_sorting/products.php
     * @magentoDataFixture Magento/PageBuilder/_files/catalog_sorting/bundle_product.php
     * @magentoDataFixture Magento/PageBuilder/_files/catalog_sorting/configurable_products.php
     * @magentoDataFixture Magento/PageBuilder/_files/catalog_sorting/grouped_product.php
     * @magentoDataFixture Magento/PageBuilder/_files/catalog_sorting/product_with_fpt.php
     * @magentoDataFixture Magento/PageBuilder/_files/catalog_sorting/downloadable_products.php
     * @throws NoSuchEntityException
     */
    public function testSortOptions(array $productSortData)
    {
        foreach ($productSortData as $rule => $expectedOrder) {

            $this->productList->setData(
                [
                    'store_id' => 1,
                    'conditions_encoded' => json_encode(
                        [
                            '1' => [
                                'aggregator' => 'all',
                                'new_child' => '',
                                'type' => \Magento\CatalogWidget\Model\Rule\Condition\Combine::class,
                                'value' => 1
                            ],
                            '1--1' => [
                                'operator' => '()',
                                'type' => \Magento\CatalogWidget\Model\Rule\Condition\Product::class,
                                'attribute' => 'sku',
                                'value' => 'B_PB_PRODUCT,a_pb_product,C_PB_PRODUCT,1_PB_PRODUCT,PB_PRODUCT_CPR,' .
                                    'PB_VIRTUAL_PRODUCT,simple_second_website,simple1,simple2,simple3,bundle_product,' .
                                    'configurable,simple_11,simple_21,gift-card,grouped,simple_100000001,' .
                                    'simple_100000002,simple-with-fpt,downloadable-product-price-on-product,' .
                                    'downloadable-product-price-on-link,ZERO_QTY_IN_STOCK_PRODUCT,special_price_product'
                            ]
                        ]
                    ),
                    'products_count' => 99
                ]
            );

            $collection = $this->productList->createCollection();

            if ($rule === 'position') {
                $collection->addCategoryFilter($this->categoryRepository->get($this->categoryId));
            }

            $actualOrder = $this->getSkus(
                $this->sortModel->applySorting(
                    $rule,
                    $collection
                )
            );

            $this->assertEquals(
                $expectedOrder,
                $actualOrder,
                $rule . ' does not match expected output.'
            );
        }
    }

    /**
     * Provide sorting rule and expected order of SKUs once sort is applied
     *
     * @return array
     */
    public function productSortDataProvider1() : array
    {
        return [
            [
                [
                    'date_newest_top' => [
                        'downloadable-product-price-on-link',
                        'downloadable-product-price-on-product',
                        'simple-with-fpt',
                        'grouped',
                        'simple_100000002',
                        'simple_100000001',
                        'configurable',
                        'bundle_product',
                        'simple3',
                        'simple1',
                        'special_price_product',
                        'ZERO_QTY_IN_STOCK_PRODUCT',
                        'gift-card',
                        'PB_VIRTUAL_PRODUCT',
                        'PB_PRODUCT_CPR',
                        '1_PB_PRODUCT',
                        'C_PB_PRODUCT',
                        'B_PB_PRODUCT',
                        'a_pb_product'
                    ],
                    'date_oldest_top' => [
                        'a_pb_product',
                        'B_PB_PRODUCT',
                        'C_PB_PRODUCT',
                        '1_PB_PRODUCT',
                        'PB_PRODUCT_CPR',
                        'PB_VIRTUAL_PRODUCT',
                        'gift-card',
                        'ZERO_QTY_IN_STOCK_PRODUCT',
                        'special_price_product',
                        'simple1',
                        'simple3',
                        'bundle_product',
                        'configurable',
                        'simple_100000001',
                        'simple_100000002',
                        'grouped',
                        'simple-with-fpt',
                        'downloadable-product-price-on-product',
                        'downloadable-product-price-on-link'
                    ],
                    'name_ascending' => [
                        '1_PB_PRODUCT',
                        'a_pb_product',
                        'B_PB_PRODUCT',
                        'bundle_product',
                        'C_PB_PRODUCT',
                        'configurable',
                        'downloadable-product-price-on-link',
                        'downloadable-product-price-on-product',
                        'gift-card',
                        'grouped',
                        'PB_PRODUCT_CPR',
                        'PB_VIRTUAL_PRODUCT',
                        'simple_100000001',
                        'simple_100000002',
                        'simple1',
                        'simple3',
                        'simple-with-fpt',
                        'special_price_product',
                        'ZERO_QTY_IN_STOCK_PRODUCT'
                    ],
                    'name_descending' => [
                        'ZERO_QTY_IN_STOCK_PRODUCT',
                        'special_price_product',
                        'simple-with-fpt',
                        'simple3',
                        'simple1',
                        'simple_100000002',
                        'simple_100000001',
                        'PB_VIRTUAL_PRODUCT',
                        'PB_PRODUCT_CPR',
                        'grouped',
                        'gift-card',
                        'downloadable-product-price-on-product',
                        'downloadable-product-price-on-link',
                        'configurable',
                        'C_PB_PRODUCT',
                        'bundle_product',
                        'B_PB_PRODUCT',
                        'a_pb_product',
                        '1_PB_PRODUCT'
                    ],
                ],
            ]
        ];
    }

    /**
     * Provide sorting rule and expected order of SKUs once sort is applied
     *
     * @return array
     */
    public function productSortDataProvider2() : array
    {
        return [
            [
                [
                    'sku_ascending' => [
                        '1_PB_PRODUCT',
                        'a_pb_product',
                        'bundle_product',
                        'B_PB_PRODUCT',
                        'configurable',
                        'C_PB_PRODUCT',
                        'downloadable-product-price-on-link',
                        'downloadable-product-price-on-product',
                        'gift-card',
                        'grouped',
                        'PB_PRODUCT_CPR',
                        'PB_VIRTUAL_PRODUCT',
                        'simple-with-fpt',
                        'simple1',
                        'simple3',
                        'simple_100000001',
                        'simple_100000002',
                        'special_price_product',
                        'ZERO_QTY_IN_STOCK_PRODUCT'
                    ],
                    'sku_descending' => [
                        'ZERO_QTY_IN_STOCK_PRODUCT',
                        'special_price_product',
                        'simple_100000002',
                        'simple_100000001',
                        'simple3',
                        'simple1',
                        'simple-with-fpt',
                        'PB_VIRTUAL_PRODUCT',
                        'PB_PRODUCT_CPR',
                        'grouped',
                        'gift-card',
                        'downloadable-product-price-on-product',
                        'downloadable-product-price-on-link',
                        'C_PB_PRODUCT',
                        'configurable',
                        'B_PB_PRODUCT',
                        'bundle_product',
                        'a_pb_product',
                        '1_PB_PRODUCT'
                    ],
                    'low_stock_first' => [
                        'gift-card',
                        'ZERO_QTY_IN_STOCK_PRODUCT',
                        'bundle_product',
                        'configurable',
                        'grouped',
                        'B_PB_PRODUCT',
                        '1_PB_PRODUCT',
                        'a_pb_product',
                        'downloadable-product-price-on-product',
                        'downloadable-product-price-on-link',
                        'simple_100000002',
                        'PB_PRODUCT_CPR',
                        'simple-with-fpt',
                        'simple_100000001',
                        'PB_VIRTUAL_PRODUCT',
                        'simple1',
                        'simple3',
                        'C_PB_PRODUCT',
                        'special_price_product'
                    ],
                    'high_stock_first' => [
                        'special_price_product',
                        'C_PB_PRODUCT',
                        'simple3',
                        'simple1',
                        'PB_VIRTUAL_PRODUCT',
                        'simple_100000001',
                        'simple-with-fpt',
                        'PB_PRODUCT_CPR',
                        'simple_100000002',
                        'downloadable-product-price-on-link',
                        'downloadable-product-price-on-product',
                        'a_pb_product',
                        '1_PB_PRODUCT',
                        'B_PB_PRODUCT',
                        'grouped',
                        'configurable',
                        'bundle_product',
                        'ZERO_QTY_IN_STOCK_PRODUCT',
                        'gift-card'
                    ],
                ],
            ]
        ];
    }

    /**
     * Provide sorting rule and expected order of SKUs once sort is applied
     *
     * @return array
     */
    public function productSortDataProvider3() : array
    {
        return [
            [
                [
                    'price_high_to_low' => [
                        'bundle_product',
                        '1_PB_PRODUCT',
                        'ZERO_QTY_IN_STOCK_PRODUCT',
                        'PB_VIRTUAL_PRODUCT',
                        'simple_100000001',
                        'simple-with-fpt',
                        'PB_PRODUCT_CPR',
                        'grouped',
                        'simple_100000002',
                        'a_pb_product',
                        'downloadable-product-price-on-product',
                        'C_PB_PRODUCT',
                        'simple3',
                        'simple1',
                        'configurable',
                        'special_price_product',
                        'downloadable-product-price-on-link',
                        'gift-card',
                        'B_PB_PRODUCT'
                    ],
                    'price_low_to_high' => [
                        'B_PB_PRODUCT',
                        'gift-card',
                        'downloadable-product-price-on-link',
                        'special_price_product',
                        'configurable',
                        'simple1',
                        'simple3',
                        'C_PB_PRODUCT',
                        'downloadable-product-price-on-product',
                        'a_pb_product',
                        'simple_100000002',
                        'grouped',
                        'PB_PRODUCT_CPR',
                        'simple-with-fpt',
                        'simple_100000001',
                        'PB_VIRTUAL_PRODUCT',
                        'ZERO_QTY_IN_STOCK_PRODUCT',
                        '1_PB_PRODUCT',
                        'bundle_product'
                    ],
                    'position' => [
                        'B_PB_PRODUCT',
                        'a_pb_product',
                        '1_PB_PRODUCT',
                        'C_PB_PRODUCT',
                        'PB_PRODUCT_CPR',
                        'PB_VIRTUAL_PRODUCT',
                        'gift-card',
                        'ZERO_QTY_IN_STOCK_PRODUCT',
                        'special_price_product'
                    ],
                    'position_by_sku' => [
                        'B_PB_PRODUCT',
                        'a_pb_product',
                        'C_PB_PRODUCT',
                        '1_PB_PRODUCT',
                        'PB_PRODUCT_CPR',
                        'PB_VIRTUAL_PRODUCT',
                        'simple1',
                        'simple3',
                        'bundle_product',
                        'configurable',
                        'gift-card',
                        'grouped',
                        'simple_100000001',
                        'simple_100000002',
                        'simple-with-fpt',
                        'downloadable-product-price-on-product',
                        'downloadable-product-price-on-link',
                        'ZERO_QTY_IN_STOCK_PRODUCT',
                        'special_price_product',
                    ]
                ],
            ]
        ];
    }

    /**
     * Retrieve SKUs from array
     *
     * @param Collection $collection
     * @return array
     */
    private function getSkus(Collection $collection): array
    {
        $skus = [];
        foreach ($collection as $product) {
            $skus[] = $product->getSku();
        }
        return $skus;
    }
}
