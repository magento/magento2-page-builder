<?php
/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Model\Catalog\CategoryListing;

use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Catalog\Model\Category;
use Magento\Catalog\Model\Config;
use Magento\Catalog\Model\Layer;
use Magento\Catalog\Model\Layer\CategoryFactory;
use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Catalog\Model\ResourceModel\Product\CollectionFactory;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Event\ManagerInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\PageBuilder\Model\Catalog\CategoryListing\CollectionBuilder;
use Magento\PageBuilder\Model\Catalog\Sorting;
use Magento\PageBuilder\Model\Catalog\Sorting\OptionInterface;
use Magento\Store\Api\Data\StoreInterface;
use Magento\Store\Model\StoreManagerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class CollectionBuilderTest extends TestCase
{
    private const STORE_ID = 1;

    private const CATEGORY_ID = 42;

    /**
     * @var CategoryFactory|MockObject
     */
    private $layerFactory;

    /**
     * @var CategoryRepositoryInterface|MockObject
     */
    private $categoryRepository;

    /**
     * @var Config|MockObject
     */
    private $catalogConfig;

    /**
     * @var ScopeConfigInterface|MockObject
     */
    private $scopeConfig;

    /**
     * @var ManagerInterface|MockObject
     */
    private $eventManager;

    /**
     * @var Sorting|MockObject
     */
    private $sorting;

    /**
     * @var CollectionFactory|MockObject
     */
    private $productCollectionFactory;

    /**
     * @var Collection|MockObject
     */
    private $collection;

    /**
     * @var CollectionBuilder
     */
    private $builder;

    protected function setUp(): void
    {
        $this->layerFactory = $this->createMock(CategoryFactory::class);
        $this->categoryRepository = $this->createMock(CategoryRepositoryInterface::class);
        $this->catalogConfig = $this->createMock(Config::class);
        $this->scopeConfig = $this->createMock(ScopeConfigInterface::class);
        $this->eventManager = $this->createMock(ManagerInterface::class);
        $this->sorting = $this->createMock(Sorting::class);
        $this->productCollectionFactory = $this->createMock(CollectionFactory::class);
        $this->collection = $this->createMock(Collection::class);

        $store = $this->createMock(StoreInterface::class);
        $store->method('getId')->willReturn(self::STORE_ID);
        $storeManager = $this->createMock(StoreManagerInterface::class);
        $storeManager->method('getStore')->willReturn($store);

        $this->builder = new CollectionBuilder(
            $this->layerFactory,
            $this->categoryRepository,
            $this->catalogConfig,
            $this->scopeConfig,
            $storeManager,
            $this->eventManager,
            $this->sorting,
            $this->productCollectionFactory
        );
    }

    public function testChosenSortOptionIsApplied(): void
    {
        $this->expectCategory('position', ['position' => 'Position', 'name' => 'Name']);
        $sortOption = $this->createMock(OptionInterface::class);
        $this->sorting->method('getSortingInstance')->with('name_ascending')->willReturn($sortOption);
        $this->sorting->expects($this->once())
            ->method('applySorting')
            ->with('name_ascending', $this->collection)
            ->willReturn($this->collection);

        $this->collection->expects($this->never())->method('setOrder');
        $this->collection->expects($this->never())->method('addAttributeToSort');

        $this->builder->build(self::CATEGORY_ID, 'name_ascending', 8, self::STORE_ID);
    }

    public function testCategoryDefaultSortByIsApplied(): void
    {
        $this->expectCategory('name', ['position' => 'Position', 'name' => 'Name']);
        $this->sorting->method('getSortingInstance')->willReturn(null);
        $this->sorting->expects($this->never())->method('applySorting');

        $this->collection->expects($this->once())->method('setOrder')->with('name', 'asc');

        $this->builder->build(self::CATEGORY_ID, null, 8, self::STORE_ID);
    }

    public function testPositionIsAppliedAsAttributeSort(): void
    {
        $this->expectCategory('position', ['position' => 'Position', 'name' => 'Name']);
        $this->collection->expects($this->once())->method('addAttributeToSort')->with('position', 'asc');
        $this->collection->expects($this->never())->method('setOrder');

        $this->builder->build(self::CATEGORY_ID, null, 8, self::STORE_ID);
    }

    public function testConfigDefaultIsUsedWhenCategoryHasNoDefaultSortBy(): void
    {
        $this->expectCategory(null, ['position' => 'Position', 'name' => 'Name']);
        $this->scopeConfig->method('getValue')->willReturn('name');

        $this->collection->expects($this->once())->method('setOrder')->with('name', 'asc');

        $this->builder->build(self::CATEGORY_ID, null, 8, self::STORE_ID);
    }

    public function testFirstAvailableOrderIsUsedWhenNoDefaultIsConfigured(): void
    {
        $this->expectCategory(null, []);
        $this->catalogConfig->method('getAttributeUsedForSortByArray')
            ->willReturn(['name' => 'Name', 'price' => 'Price']);
        $this->scopeConfig->method('getValue')->willReturn(null);

        $this->collection->expects($this->once())->method('setOrder')->with('name', 'asc');

        $this->builder->build(self::CATEGORY_ID, null, 8, self::STORE_ID);
    }

    public function testPageSizeAndPageAreApplied(): void
    {
        $this->expectCategory('position', ['position' => 'Position']);
        $this->collection->expects($this->once())->method('setPageSize')->with(8)->willReturnSelf();
        $this->collection->expects($this->once())->method('setCurPage')->with(1)->willReturnSelf();

        $this->builder->build(self::CATEGORY_ID, null, 8, self::STORE_ID);
    }

    public function testPrepareEventIsDispatchedBeforeTheCategoryIsSetOnTheLayer(): void
    {
        $category = $this->expectCategory('position', ['position' => 'Position']);

        $dispatched = [];
        $this->eventManager->expects($this->once())
            ->method('dispatch')
            ->willReturnCallback(function ($name, $data) use (&$dispatched) {
                $dispatched = [$name, $data];
            });

        $this->builder->build(self::CATEGORY_ID, null, 8, self::STORE_ID);

        $this->assertSame(CollectionBuilder::PREPARE_EVENT, $dispatched[0]);
        $this->assertSame($category, $dispatched[1]['category']);
        $this->assertSame(self::STORE_ID, $dispatched[1]['store_id']);
        $this->assertArrayHasKey('layer', $dispatched[1]);
    }

    public function testMissingCategoryReturnsAnEmptyCollection(): void
    {
        $this->categoryRepository->method('get')
            ->willThrowException(new NoSuchEntityException(__('No such entity.')));

        $emptyCollection = $this->createMock(Collection::class);
        $emptyCollection->expects($this->once())->method('addIdFilter')->with([0])->willReturnSelf();
        $this->productCollectionFactory->method('create')->willReturn($emptyCollection);

        $this->layerFactory->expects($this->never())->method('create');
        $this->eventManager->expects($this->never())->method('dispatch');

        $this->assertSame($emptyCollection, $this->builder->build(self::CATEGORY_ID, null, 8, self::STORE_ID));
    }

    public function testDisabledCategoryReturnsAnEmptyCollection(): void
    {
        $category = $this->createMock(Category::class);
        $category->method('getIsActive')->willReturn(false);
        $this->categoryRepository->method('get')->willReturn($category);

        $emptyCollection = $this->createMock(Collection::class);
        $emptyCollection->method('addIdFilter')->willReturnSelf();
        $this->productCollectionFactory->method('create')->willReturn($emptyCollection);

        $this->layerFactory->expects($this->never())->method('create');

        $this->assertSame($emptyCollection, $this->builder->build(self::CATEGORY_ID, null, 8, self::STORE_ID));
    }

    /**
     * Configure the repository, the layer and the collection for an existing category
     *
     * @param string|null $defaultSortBy
     * @param array $availableSortByOptions
     * @return Category|MockObject
     */
    private function expectCategory(?string $defaultSortBy, array $availableSortByOptions)
    {
        $category = $this->createMock(Category::class);
        $category->method('getIsActive')->willReturn(true);
        $category->method('getDefaultSortBy')->willReturn($defaultSortBy);
        $category->method('getAvailableSortByOptions')->willReturn($availableSortByOptions);

        $this->categoryRepository->method('get')
            ->with(self::CATEGORY_ID, self::STORE_ID)
            ->willReturn($category);

        $this->collection->method('setPageSize')->willReturnSelf();
        $this->collection->method('setCurPage')->willReturnSelf();

        $layer = $this->createMock(Layer::class);
        $layer->method('getProductCollection')->willReturn($this->collection);
        $this->layerFactory->method('create')->willReturn($layer);

        return $category;
    }
}
