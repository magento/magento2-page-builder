<?php
/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Block\Catalog\Product;

use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Catalog\Model\Category;
use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Catalog\ViewModel\Product\OptionsData;
use Magento\CatalogWidget\Model\Rule\Condition\Product\CategoryConditionProcessor;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\Url\EncoderInterface;
use Magento\Framework\View\LayoutFactory;
use Magento\Framework\TestFramework\Unit\Helper\ObjectManager;
use Magento\PageBuilder\Block\Catalog\Product\CategoryListing;
use Magento\PageBuilder\Model\Catalog\CategoryListing\CollectionBuilder;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class CategoryListingTest extends TestCase
{
    /**
     * @var CollectionBuilder|MockObject
     */
    private $collectionBuilder;

    /**
     * @var ObjectManager
     */
    private $objectManager;

    protected function setUp(): void
    {
        $this->collectionBuilder = $this->createMock(CollectionBuilder::class);
        $this->objectManager = new ObjectManager($this);
    }

    public function testCollectionIsBuiltFromTheWidgetParameters(): void
    {
        $collection = $this->createMock(Collection::class);
        $block = $this->createBlock([
            'category_id' => '42',
            'sort_order' => 'name_ascending',
            'products_count' => '8',
            'store_id' => '3',
        ]);

        $this->collectionBuilder->expects($this->once())
            ->method('build')
            ->with(42, 'name_ascending', 8, 3, $block)
            ->willReturn($collection);

        $this->assertSame($collection, $block->createCollection());
    }

    public function testCollectionIsBuiltOnlyOnce(): void
    {
        $collection = $this->createMock(Collection::class);
        $block = $this->createBlock(['category_id' => '42', 'products_count' => '8']);

        $this->collectionBuilder->expects($this->once())
            ->method('build')
            ->with(42, null, 8, null, $block)
            ->willReturn($collection);

        $block->createCollection();
        $block->getBaseCollection();
    }

    public function testCategoryIsResolvedFromTheWidgetChooserIdPath(): void
    {
        $collection = $this->createMock(Collection::class);
        $block = $this->createBlock([
            'id_path' => 'category/42',
            'category_id' => '',
            'products_count' => '8',
        ]);

        $this->collectionBuilder->expects($this->once())
            ->method('build')
            ->with(42, null, 8, null, $block)
            ->willReturn($collection);

        $this->assertSame($collection, $block->createCollection());
    }

    public function testCategoryIdTakesPrecedenceOverIdPath(): void
    {
        $collection = $this->createMock(Collection::class);
        $block = $this->createBlock([
            'id_path' => 'category/7',
            'category_id' => '42',
            'products_count' => '8',
        ]);

        $this->collectionBuilder->expects($this->once())
            ->method('build')
            ->with(42, null, 8, null, $block)
            ->willReturn($collection);

        $block->createCollection();
    }

    public function testIdentitiesContainTheCategoryTagForAnIdPathWidget(): void
    {
        $collection = $this->createMock(Collection::class);
        $collection->method('getIterator')->willReturn(new \ArrayIterator([]));
        $block = $this->createBlock(['id_path' => 'category/42', 'products_count' => '8']);
        $this->collectionBuilder->method('build')->willReturn($collection);
        $block->setProductCollection($collection);

        $this->assertContains(Category::CACHE_TAG . '_42', $block->getIdentities());
    }

    public function testIdentitiesContainTheCategoryTag(): void
    {
        $collection = $this->createMock(Collection::class);
        $collection->method('getIterator')->willReturn(new \ArrayIterator([]));
        $block = $this->createBlock(['category_id' => '42', 'products_count' => '8']);
        $this->collectionBuilder->method('build')->willReturn($collection);
        $block->setProductCollection($collection);

        $this->assertContains(Category::CACHE_TAG . '_42', $block->getIdentities());
    }

    /**
     * @param array $data
     * @return CategoryListing
     */
    private function createBlock(array $data): CategoryListing
    {
        return $this->objectManager->getObject(
            CategoryListing::class,
            [
                'collectionBuilder' => $this->collectionBuilder,
                'data' => $data,
                'json' => $this->createMock(Json::class),
                'layoutFactory' => $this->createMock(LayoutFactory::class),
                'urlEncoder' => $this->createMock(EncoderInterface::class),
                'categoryRepository' => $this->createMock(CategoryRepositoryInterface::class),
                'optionsData' => $this->createMock(OptionsData::class),
                'categoryConditionProcessor' => $this->createMock(CategoryConditionProcessor::class),
            ]
        );
    }
}
