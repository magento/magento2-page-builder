<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\CatalogWidget\Block\Product;

use Magento\Catalog\Api\Data\CategoryInterface;
use Magento\CatalogWidget\Block\Product\ProductsList;
use Magento\Store\Model\Store;
use Magento\TestFramework\Helper\Bootstrap;
use PHPUnit\Framework\TestCase;

/**
 * Test catalog products list widget block with page builder
 *
 * @magentoAppArea adminhtml
 * @magentoAppIsolation enabled
 */
class ProductListTest extends TestCase
{
    /**
     * @var ProductsList
     */
    private $block;

    /**
     * @inheritdoc
     */
    protected function setUp(): void
    {
        parent::setUp();
        $objectManager = Bootstrap::getObjectManager();
        $this->block = $objectManager->create(ProductsList::class);
    }

    /**
     * Test that sorting by price works correctly
     *
     * @magentoDbIsolation disabled
     * @magentoConfigFixture default_store catalog/price/scope 1
     * @magentoDataFixture Magento/Catalog/_files/category_with_different_price_products.php
     * @param string $order
     * @param array $skus
     * @dataProvider priceSortDataProvider
     */
    public function testPriceSort(string $order, array $skus)
    {
        $encodedConditions = '^[`1`:^[`type`:`Magento||CatalogWidget||Model||Rule||Condition||Combine`,
        `aggregator`:`all`,`value`:`1`,`new_child`:``^],
        `1--1`:^[`type`:`Magento||CatalogWidget||Model||Rule||Condition||Product`,
        `attribute`:`sku`,`operator`:`()`,`value`:`simple1000,simple1001`^]^]';

        $this->block->setData('sort_order', $order);
        $this->block->setData('conditions_encoded', $encodedConditions);
        $this->block->setStoreId(Store::DEFAULT_STORE_ID);
        $productCollection = $this->block->createCollection();
        $productCollection->load();
        $this->assertEquals($skus, $productCollection->getColumnValues('sku'));
    }

    /**
     * Test that filtering by price works correctly
     *
     * @magentoDbIsolation disabled
     * @magentoConfigFixture default_store catalog/price/scope 1
     * @magentoDataFixture Magento/Catalog/_files/category_with_different_price_products.php
     * @param string $operator
     * @param int $value
     * @param array $matches
     * @dataProvider priceFilterDataProvider
     */
    public function testPriceFilter(string $operator, int $value, array $matches)
    {
        $encodedConditions = '^[`1`:^[`type`:`Magento||CatalogWidget||Model||Rule||Condition||Combine`,
        `aggregator`:`all`,`value`:`1`,`new_child`:``^],
        `1--1`:^[`type`:`Magento||CatalogWidget||Model||Rule||Condition||Product`,
        `attribute`:`sku`,`operator`:`()`,`value`:`simple1000,simple1001`^],
        `1--2`:^[`type`:`Magento||CatalogWidget||Model||Rule||Condition||Product`,
        `attribute`:`price`,`operator`:`' . $operator . '`,`value`:`' . $value . '`^]^]';

        $this->block->setData('conditions_encoded', $encodedConditions);
        $this->block->setStoreId(Store::DEFAULT_STORE_ID);
        $productCollection = $this->block->createCollection();
        $productCollection->load();
        $this->assertEqualsCanonicalizing($matches, $productCollection->getColumnValues('sku'));
    }

    /**
     * Test product list widget with product that has different price on each website
     *
     * @magentoDbIsolation disabled
     * @magentoConfigFixture default_store catalog/price/scope 1
     * @magentoDataFixture Magento/Catalog/_files/product_with_price_on_second_website.php
     */
    public function testProductWithDifferentPriceOnEachWebsite(): void
    {
        $sku = 'second-website-price-product';
        $encodedConditions = '^[`1`:^[`type`:`Magento||CatalogWidget||Model||Rule||Condition||Combine`,
        `aggregator`:`all`,`value`:`1`,`new_child`:``^],
        `1--1`:^[`type`:`Magento||CatalogWidget||Model||Rule||Condition||Product`,
        `attribute`:`sku`,`operator`:`==`,`value`:`' . $sku . '`^]^]';

        $this->block->setData('conditions_encoded', $encodedConditions);
        $this->block->setStoreId(Store::DEFAULT_STORE_ID);
        $productCollection = $this->block->createCollection();
        $productCollection->load();
        $this->assertEquals([$sku], $productCollection->getColumnValues('sku'));
    }

    /**
     * Test that filtering by category works correctly together with sorting
     *
     * @magentoDbIsolation disabled
     * @magentoDataFixture Magento/Catalog/_files/multiple_products.php
     * @magentoDataFixture Magento/Catalog/_files/products_list.php
     * @magentoDataFixture Magento/Catalog/_files/categories_no_products.php
     * @param array $categories
     * @param int $categoryId
     * @param string $order
     * @param array $skus
     * @dataProvider categoryFilterAndSortDataProvider
     */
    public function testCategoryFilterAndSort(array $categories, int $categoryId, string $order, array $skus): void
    {
        $objectManager = Bootstrap::getObjectManager();
        foreach ($categories as $id => $data) {
            /** @var CategoryInterface $categoryAnchor */
            $category = $objectManager->create(CategoryInterface::class);
            $category->load($id);
            $category->setIsAnchor($data['is_anchor']);
            $category->setPostedProducts($data['products']);
            $category->save();
        }

        $encodedConditions = '^[`1`:^[`type`:`Magento||CatalogWidget||Model||Rule||Condition||Combine`,
        `aggregator`:`all`,`value`:`1`,`new_child`:``^],
        `1--1`:^[`type`:`Magento||CatalogWidget||Model||Rule||Condition||Product`,
        `attribute`:`category_ids`,`operator`:`==`,`value`:`' . $categoryId . '`^]^]';

        $this->block->setData('sort_order', $order);
        $this->block->setData('condition_option', 'category_ids');
        $this->block->setData('condition_option_value', $categoryId);
        $this->block->setData('conditions_encoded', $encodedConditions);
        $this->block->setStoreId(Store::DEFAULT_STORE_ID);
        $productCollection = $this->block->createCollection();
        $productCollection->load();
        $this->assertEquals($skus, $productCollection->getColumnValues('sku'));
    }

    /**
     * @return array
     */
    public function priceFilterDataProvider(): array
    {
        return [
            [
                '>',
                10,
                [
                    'simple1001',
                ]
            ],
            [
                '>=',
                10,
                [
                    'simple1000',
                    'simple1001',
                ]
            ],
            [
                '<',
                10,
                []
            ],
            [
                '<',
                20,
                [
                    'simple1000',
                ]
            ],
        ];
    }

    /**
     * @return array
     */
    public function priceSortDataProvider(): array
    {
        return [
            [
                'price_low_to_high',
                [
                    'simple1000',
                    'simple1001',
                ]
            ],
            [
                'price_high_to_low',
                [
                    'simple1001',
                    'simple1000',
                ]
            ],
        ];
    }

    /**
     * @return array
     */
    public function categoryFilterAndSortDataProvider(): array
    {
        $categories = [
            //Category 1
            3 => [
                'is_anchor' => true,
                'products' => [
                    //simple-249
                    153 => 0,
                    //simple-156
                    156 => 1,
                ]
            ],
            //Category 1.1
            4 => [
                'is_anchor' => false,
                'products' => [
                    //simple-156
                    156 => 0,
                    //simple2
                    11 => 1,
                    //simple-249
                    153 => 2,
                ]
            ],
            //Category 1.1.1
            5 => [
                'is_anchor' => false,
                'products' => [
                    //simple1
                    10 => 1,
                ]
            ]
        ];
        return [
            [
                $categories,
                3,
                'position',
                [
                    'simple-249',
                    'simple-156',
                    'simple2',
                    'simple1',
                ]
            ],
            [
                $categories,
                4,
                'position',
                [
                    'simple-156',
                    'simple2',
                    'simple-249',
                ]
            ],
            [
                $categories,
                3,
                'date_newest_top',
                [
                    'simple-156',
                    'simple-249',
                    'simple2',
                    'simple1',
                ]
            ],
            [
                $categories,
                4,
                'date_newest_top',
                [
                    'simple-156',
                    'simple-249',
                    'simple2',
                ]
            ]
        ];
    }
}
