<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\Form\Element;

/**
 * @magentoAppArea adminhtml
 * @magentoDataFixture Magento/PageBuilder/_files/product_totals/products.php
 */
class ProductTotalsTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    /**
     * @var \Magento\Framework\Serialize\SerializerInterface
     */
    private $serializer;

    /**
     * @inheritdoc
     */
    protected function setUp()
    {
        parent::setUp();
        $this->serializer = $this->_objectManager->get(\Magento\Framework\Serialize\SerializerInterface::class);
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
        $this->getRequest()->setMethod(\Magento\Framework\App\Request\Http::METHOD_POST);
        $this->getRequest()->setPostValue(['conditionValue' => json_encode($condition)]);

        $this->dispatch('backend/pagebuilder/form/element_producttotals');
        $decoded = $this->serializer->unserialize($this->getResponse()->getBody());

        $this->assertEquals(
            [$decoded['total'], $decoded['disabled'], $decoded['notVisible'], $decoded['outOfStock']],
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
            [ // #1 category with 4 products, 3 disabled, 3 not visible
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
                [8, 3, 3, 1]
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
