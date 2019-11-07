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
     * @param int $expectedTotal
     * @param int $expectedDisabled
     * @dataProvider productDataProvider
     */
    public function testProductTotals($condition, $expectedTotal, $expectedDisabled)
    {
        $this->getRequest()->setMethod(\Magento\Framework\App\Request\Http::METHOD_POST);
        $this->getRequest()->setPostValue(['conditionValue' => json_encode($condition)]);

        $this->dispatch('backend/pagebuilder/form/element_producttotals');
        $decoded = $this->serializer->unserialize($this->getResponse()->getBody());

        $this->assertEquals($expectedTotal, $decoded['total']);
        $this->assertEquals($expectedDisabled, $decoded['disabled']);
    }

    /**
     * @return array
     */
    public function productDataProvider()
    {
        return [
            // category with no products
            [
                [
                    '1' => [
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
                    ],
                ],
                0,
                0
            ],
            // category with 4 products, 1 disabled
            [
                [
                    '1' => [
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
                    ],
                ],
                4,
                1
            ],
            // sku with no matches
            [
                [
                    '1' => [
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
                    ],
                ],
                0,
                0
            ],
            // sku with 2 matches, 1 disabled
            [
                [
                    '1' => [
                        'aggregator' => 'all',
                        'new_child' => '',
                        'type' => \Magento\CatalogWidget\Model\Rule\Condition\Combine::class,
                        'value' => '1',
                    ],
                    '1--1' => [
                        'operator' => '()',
                        'type' => \Magento\CatalogWidget\Model\Rule\Condition\Product::class,
                        'attribute' => 'sku',
                        'value' => 'simple-3, simple-4'
                    ],
                ],
                2,
                1
            ],
            // condition with no matches
            [
                [
                    '1' => [
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
                    ],
                ],
                0,
                0
            ],
            // condition with 3 matches, 1 disabled
            [
                [
                    '1' => [
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
                    ],
                ],
                3,
                1
            ],
        ];
    }
}
