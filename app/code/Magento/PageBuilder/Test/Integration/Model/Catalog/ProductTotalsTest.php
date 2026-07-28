<?php
/**
 * Copyright 2025 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Test\Integration\Model\Catalog;

use Magento\Catalog\Test\Fixture\Category as CategoryFixture;
use Magento\Catalog\Test\Fixture\Product as ProductFixture;
use Magento\CatalogWidget\Model\Rule\Condition\Combine;
use Magento\CatalogWidget\Model\Rule\Condition\Product;
use Magento\PageBuilder\Model\Catalog\ProductTotals;
use Magento\TestFramework\Fixture\DataFixture;
use Magento\TestFramework\Fixture\DataFixtureStorageManager;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class ProductTotalsTest extends TestCase
{
    /**
     * @var ProductTotals
     */
    private $productTotals;
    
    /**
     * @var DataFixtureStorageManager
     */
    private $fixtures;

    /**
     * @inheritDoc
     */
    protected function setUp(): void
    {
        $this->productTotals = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()
            ->create(ProductTotals::class);
        $this->fixtures = DataFixtureStorageManager::getStorage();
    }
    
    #[
        DataProvider('getProductTotalsDataProvider'),
        // level 1 categories
        DataFixture(CategoryFixture::class, ['is_anchor' => 1], 'category1'),
        DataFixture(CategoryFixture::class, ['is_anchor' => 1], 'category2'),
        DataFixture(CategoryFixture::class, ['is_anchor' => 0], 'category3'),
        // level 2 categories
        DataFixture(CategoryFixture::class, ['parent_id' => '$category1.id$'], 'category11'),
        DataFixture(CategoryFixture::class, ['parent_id' => '$category2.id$'], 'category21'),
        DataFixture(CategoryFixture::class, ['parent_id' => '$category3.id$'], 'category31'),
        // level 3 categories
        DataFixture(CategoryFixture::class, ['parent_id' => '$category11.id$'], 'category111'),
        // products assigned to level 1 categories
        DataFixture(ProductFixture::class, ['category_ids' => ['$category1.id$']], as: 'product1'),
        DataFixture(ProductFixture::class, ['category_ids' => ['$category2.id$']], as: 'product2'),
        DataFixture(ProductFixture::class, ['category_ids' => ['$category3.id$']], as: 'product3'),
        // unassigned product
        DataFixture(ProductFixture::class, as: 'product4'),
        // products assigned to level 2 categories
        DataFixture(ProductFixture::class, ['category_ids' => ['$category11.id$']], as: 'product11'),
        DataFixture(ProductFixture::class, ['category_ids' => ['$category21.id$']], as: 'product21'),
        DataFixture(ProductFixture::class, ['category_ids' => ['$category31.id$']], as: 'product31'),
        // products assigned to level 3 categories
        DataFixture(ProductFixture::class, ['category_ids' => ['$category111.id$']], as: 'product111'),
    ]
    public function testGetProductTotals(
        array $conditions,
        array $totals
    ): void {
        $conditions = $this->flattenConditions($this->prepareConditions($conditions));
        $this->assertEquals(
            $totals,
            $this->productTotals->getProductTotals(json_encode($conditions))
        );
    }
    
    public static function getProductTotalsDataProvider(): array
    {
        return [
            // single anchor category
            'Category is - category1' => [
                [
                    ['category_ids', '==', '$category1.id$']
                ],
                [
                    'total' => 3,
                    'disabled' => 0,
                    'notVisible' => 0
                ]
            ],
            // multiple anchor categories
            'Category is - category1,category2' => [
                [
                    ['category_ids', '==', '$category1.id$,$category2.id$']
                ],
                [
                    'total' => 5,
                    'disabled' => 0,
                    'notVisible' => 0
                ]
            ],
            // anchor and non-anchor category
            'Category is - category1,category3' => [
                [
                    // spaces are intentional to check trimming functionality
                    ['category_ids', '==', '$category1.id$ , $category3.id$',]
                ],
                [
                    'total' => 4,
                    'disabled' => 0,
                    'notVisible' => 0
                ]
            ],
            // single non-anchor category
            'Category is - category3' => [
                [
                    ['category_ids', '==', '$category3.id$']
                ],
                [
                    'total' => 1,
                    'disabled' => 0,
                    'notVisible' => 0
                ]
            ],
        ];
    }

    private function prepareConditions(array $data) : array
    {
        $conditions = $data;
        if (array_is_list($conditions)) {
            $conditions = [
                'conditions' => $conditions,
            ];
        }
        $conditions += [
            'type' => Combine::class,
            'attribute' => null,
            'value' => true,
            'operator' => null,
            'aggregator' => 'all',
            'is_value_processed' => null,
            'conditions' => [

            ],
        ];
        $subConditions = $conditions['conditions'];
        $conditions['conditions'] = [];

        foreach ($subConditions as $condition) {
            if (isset($condition['conditions']) || (array_is_list($condition) && is_array($condition[0]))) {
                $condition = $this->prepareConditions($condition);
            } else {
                if (array_is_list($condition)) {
                    list($attribute, $operator, $value) = array_pad($condition, 3, null);
                    $condition = [
                        'attribute' => $attribute,
                        'operator' => $operator,
                        'value' => $value,
                    ];
                }
                $condition += [
                    'type' => Product::class,
                    'attribute' => null,
                    'value' => null,
                    'operator' => '==',
                    'is_value_processed' => false,
                ];
                foreach (['attribute', 'value'] as $field) {
                    if (!$condition[$field]) {
                        continue;
                    }
                    $condition[$field] = preg_replace_callback(
                        '/(\$(\w+)(\.\w+)?\$)/',
                        function ($matches) {
                            return $this->substitute($matches[1]);
                        },
                        (string) $condition[$field]
                    );
                }
            }

            $conditions['conditions'][] = $condition;
        }
        return $conditions;
    }

    private function flattenConditions(array $conditions, ?string $parent = null): array
    {
        $prefix = $parent === null ? '' : $parent . '--';
        if (!array_is_list($conditions)) {
            $conditions = [$conditions];
        }
        $counter = 1;
        $result = [];
        foreach ($conditions as $item) {
            $key = $prefix . ($counter++);
            $subConditions = $item['conditions'] ?? [];
            unset($item['conditions']);
            $result[$key] = $item;
            $result += $this->flattenConditions($subConditions, $key);
        }
        return $result;
    }

    private function substitute(string $expression): string
    {
        list($fixtureName, $attribute) = array_pad(explode('.', trim($expression, '$')), 2, null);
        $fixtureData = $this->fixtures->get($fixtureName);
        if (!$fixtureData) {
            throw new \InvalidArgumentException("Unable to resolve fixture reference '$expression'");
        }
        $value = $attribute ? $fixtureData->getDataUsingMethod($attribute) : $fixtureData;
        return (string) $value;
    }
}
