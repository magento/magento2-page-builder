<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog;

use Magento\TestFramework\Helper\Bootstrap;

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
     * @param string condition
     * @param int $expectedTotals
     * @dataProvider productDataProvider
     */
    public function testProductTotals(
        $condition,
        $expectedTotals
    ) {
        $this->assertEquals(
            array_values($this->productTotals->getProductTotals($condition)),
            $expectedTotals
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
                ],
                [0, 0, 0, 0]
            ],
            [ // #1 category with 4 products, 3 disabled, 3 not visible (but 2 not visible disabled)
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
                ],
                [8, 3, 1, 1]
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
                ],
                [0, 0, 0, 0]
            ],
            [ // #3 sku with 2 matches, 1 disabled, 1 not visible, 1 out of stock
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
                        'value' => 'not-visible-on-storefront, disabled-product, out-of-stock'
                    ]
                ],
                [3, 1, 1, 1]
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
                ],
                [0, 0, 0, 0]
            ],
            [ // #5 condition with 3 matches, 1 disabled, 1 not visible
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
                ],
                [3, 1, 1, 0]
            ],
        ];
    }
}
