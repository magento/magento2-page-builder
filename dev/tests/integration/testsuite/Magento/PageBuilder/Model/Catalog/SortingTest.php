<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog;

use Magento\TestFramework\Helper\Bootstrap;
use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\CatalogWidget\Block\Product\ProductsList;

/**
 * Class SortingTest
 */
class SortingTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory
     */
    private $productCollectionFactory;

    /**
     * @var \Magento\PageBuilder\Model\Catalog\Sorting
     */
    private $sortModel;

    /**
     * @var CategoryRepositoryInterface
     */
    private $categoryRepository;

    /**
     * @var \Magento\Indexer\Model\Indexer
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
            \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory::class
        );
        $this->sortModel = $objectManager->create(Sorting::class);
        $this->categoryRepository = $objectManager->create(
            CategoryRepositoryInterface::class
        );

        $this->productList = $objectManager->create(ProductsList::class);
    }

    /**
     * @param array $productSortData
     * @dataProvider productSortDataProvider
     * @magentoDataFixture Magento/PageBuilder/_files/catalog_sorting/products.php
     */
    public function testSortOptions(array $productSortData)
    {
        foreach ($productSortData as $rule => $expectedOrder) {

            $this->productList->setData(
                [
                    'store_id' => 1,
                    'conditions_encoded' => '^[
                        `1`:^[
                            `aggregator`:`all`,
                            `new_child`:``,
                            `type`:`Magento||CatalogWidget||Model||Rule||Condition||Combine`,
                            `value`:`1`
                            ^],
                            `1--1`:^[
                                `operator`:`()`,
                                `type`:`Magento||CatalogWidget||Model||Rule||Condition||Product`,
                                `attribute`:`sku`,
                                `value`:`B_PB_PRODUCT,a_pb_product,C_PB_PRODUCT,1_PB_PRODUCT`
                                ^]
                            ^]'
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
    public function productSortDataProvider() : array
    {
        return [
            [
                [
                    'date_newest_top' => [
                        '1_PB_PRODUCT',
                        'C_PB_PRODUCT',
                        'B_PB_PRODUCT',
                        'a_pb_product'
                    ],
                    'date_oldest_top' => [
                        'a_pb_product',
                        'B_PB_PRODUCT',
                        'C_PB_PRODUCT',
                        '1_PB_PRODUCT'
                    ],
                    'name_ascending' => [
                        '1_PB_PRODUCT',
                        'a_pb_product',
                        'B_PB_PRODUCT',
                        'C_PB_PRODUCT'
                    ],
                    'name_descending' => [
                        'C_PB_PRODUCT',
                        'B_PB_PRODUCT',
                        'a_pb_product',
                        '1_PB_PRODUCT'
                    ],
                    'sku_ascending' => [
                        '1_PB_PRODUCT',
                        'a_pb_product',
                        'B_PB_PRODUCT',
                        'C_PB_PRODUCT'
                    ],
                    'sku_descending' => [
                        'C_PB_PRODUCT',
                        'B_PB_PRODUCT',
                        'a_pb_product',
                        '1_PB_PRODUCT'
                    ],
                    'low_stock_first' => [
                        'B_PB_PRODUCT',
                        '1_PB_PRODUCT',
                        'a_pb_product',
                        'C_PB_PRODUCT'
                    ],
                    'high_stock_first' => [
                        'C_PB_PRODUCT',
                        'a_pb_product',
                        '1_PB_PRODUCT',
                        'B_PB_PRODUCT'
                    ],
                    'price_high_to_low' => [
                        '1_PB_PRODUCT',
                        'a_pb_product',
                        'C_PB_PRODUCT',
                        'B_PB_PRODUCT'
                    ],
                    'price_low_to_high' => [
                        'B_PB_PRODUCT',
                        'C_PB_PRODUCT',
                        'a_pb_product',
                        '1_PB_PRODUCT'
                    ],
                    'position' => [
                        'B_PB_PRODUCT',
                        'a_pb_product',
                        '1_PB_PRODUCT',
                        'C_PB_PRODUCT'
                    ],
                    'position_by_sku' => [
                        'B_PB_PRODUCT',
                        'a_pb_product',
                        'C_PB_PRODUCT',
                        '1_PB_PRODUCT'
                    ]
                ],
            ]
        ];
    }

    /**
     * Retrieve SKUs from array
     *
     * @param \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
     * @return array
     */
    private function getSkus(\Magento\Catalog\Model\ResourceModel\Product\Collection $collection): array
    {
        $skus = [];
        foreach ($collection as $product) {
            $skus[] = $product->getSku();
        }
        return $skus;
    }
}
