<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog;

use Magento\Framework\Exception\LocalizedException;
use Magento\TestFramework\Helper\Bootstrap;
use Zend_Db_Select_Exception;

/**
 * Class ProductTotalsTest
 */
class ProductTotalsTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var ProductTotals
     */
    private $productTotals;

    /**
     * Set up instances and mock objects
     */
    protected function setUp()
    {
        $objectManager = Bootstrap::getObjectManager();
        $this->productTotals = $objectManager->create(ProductTotals::class);
    }

    /**
     * @magentoAppIsolation enabled
     * @magentoDataFixture Magento/PageBuilder/_files/product_totals/products.php
     * @magentoDataFixture Magento/PageBuilder/_files/product_totals/configurable_products.php
     * @magentoDataFixture Magento/PageBuilder/_files/product_totals/bundle_product.php
     * @magentoDataFixture Magento/GroupedProduct/_files/product_grouped_with_simple_out_of_stock.php
     * @magentoDataFixture Magento/GiftCard/_files/gift_card.php
     * @param array condition
     * @param int $expectedTotals
     * @dataProvider productDataProvider
     * @throws LocalizedException
     * @throws Zend_Db_Select_Exception
     */
    public function testProductTotals(
        $condition,
        $expectedTotals
    ) {
        $this->assertEquals(
            $expectedTotals,
            array_values($this->productTotals->getProductTotals(json_encode($condition)))
        );
    }

    /**
     * @return array
     */
    public function productDataProvider()
    {
        return [
            [ // #0 category with no products
                ['1' => [
                    'aggregator' => 'all',
                    'new_child' => '',
                    'type' => \Magento\CatalogWidget\Model\Rule\Condition\Combine::class,
                    'value' => '1',
                ],
                    '1--1' => [
                        'operator' => '==',
                        'type' => \Magento\CatalogWidget\Model\Rule\Condition\Product::class,
                        'attribute' => 'category_ids',
                        'value' => '4'
                    ]
                ], [0, 0, 0, 0]
            ],
            [ // #1 category with 16 products, 3 disabled, 3 not visible (but 2 not visible disabled), 2 out of stock (1 oos disabled
                ['1' => [
                    'aggregator' => 'all',
                    'new_child' => '',
                    'type' => \Magento\CatalogWidget\Model\Rule\Condition\Combine::class,
                    'value' => '1',
                ],
                    '1--1' => [
                        'operator' => '==',
                        'type' => \Magento\CatalogWidget\Model\Rule\Condition\Product::class,
                        'attribute' => 'category_ids',
                        'value' => '3'
                    ]
                ], [12, 3, 1, 1]
            ],
            [ // #2 sku with no matches
                ['1' => [
                    'aggregator' => 'all',
                    'new_child' => '',
                    'type' => \Magento\CatalogWidget\Model\Rule\Condition\Combine::class,
                    'value' => '1',
                ],
                    '1--1' => [
                        'operator' => '()',
                        'type' => \Magento\CatalogWidget\Model\Rule\Condition\Product::class,
                        'attribute' => 'sku',
                        'value' => 'shoes'
                    ]
                ], [0, 0, 0, 0]
            ],
            [ // #3 sku with 2 matches, 1 disabled, 3 not visible, 1 out of stock
                ['1' => [
                    'aggregator' => 'all',
                    'new_child' => '',
                    'type' => \Magento\CatalogWidget\Model\Rule\Condition\Combine::class,
                    'value' => '1',
                ],
                    '1--1' => [
                        'operator' => '()',
                        'type' => \Magento\CatalogWidget\Model\Rule\Condition\Product::class,
                        'attribute' => 'sku',
                        'value' => 'not-visible-on-storefront, disabled-product, out-of-stock, simple_11, simple_21'
                    ]
                ], [5, 1, 3, 1]
            ],
            [ // #4 condition with no matches
                ['1' => [
                    'aggregator' => 'all',
                    'new_child' => '',
                    'type' => \Magento\CatalogWidget\Model\Rule\Condition\Combine::class,
                    'value' => '1',
                ],
                    '1--1' => [
                        'operator' => '>=',
                        'type' => \Magento\CatalogWidget\Model\Rule\Condition\Product::class,
                        'attribute' => 'price',
                        'value' => '10000'
                    ]
                ], [0, 0, 0, 0]
            ],
            [ // #5 condition with 6 matches, 1 disabled, 2 not visible
                ['1' => [
                    'aggregator' => 'all',
                    'new_child' => '',
                    'type' => \Magento\CatalogWidget\Model\Rule\Condition\Combine::class,
                    'value' => '1',
                ],
                    '1--1' => [
                        'operator' => '<',
                        'type' => \Magento\CatalogWidget\Model\Rule\Condition\Product::class,
                        'attribute' => 'price',
                        'value' => '20'
                    ]
                ], [6, 1, 2, 0]
            ],
        ];
    }
}
