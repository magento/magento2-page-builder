<?php
/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Test\Integration\Block\Catalog\Product;

use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Catalog\Block\Product\ListProduct;
use Magento\Catalog\Block\Product\ProductList\Toolbar;
use Magento\Catalog\Model\Category;
use Magento\Catalog\Model\Config;
use Magento\Catalog\Model\Layer\Resolver;
use Magento\Catalog\Model\ResourceModel\Category\CollectionFactory;
use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Framework\Registry;
use Magento\Framework\View\LayoutInterface;
use Magento\PageBuilder\Block\Catalog\Product\CategoryListing;
use Magento\TestFramework\Helper\Bootstrap;
use Magento\TestFramework\ObjectManager;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * @magentoAppArea frontend
 * @magentoDbIsolation disabled
 */
class CategoryListingTest extends TestCase
{
    private const CATEGORY_URL_KEY = 'pb-category-listing';

    /**
     * @var ObjectManager
     */
    private $objectManager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->objectManager = Bootstrap::getObjectManager();
    }

    /**
     * @magentoDataFixture Magento_PageBuilder::Test/Integration/_files/category_listing_products.php
     */
    #[DataProvider('sortOrderDataProvider')]
    public function testListingMatchesTheCategoryPage(?string $sortOrder, array $expectedSkus): void
    {
        $blockCollection = $this->createBlock($sortOrder)->createCollection();
        $blockCollection->load();

        $this->assertSame($expectedSkus, $blockCollection->getColumnValues('sku'));
        $this->assertSame(
            $this->categoryPageIds($sortOrder === null ? null : 'name'),
            array_map('intval', $blockCollection->getColumnValues('entity_id'))
        );
    }

    /**
     * @return array
     */
    public static function sortOrderDataProvider(): array
    {
        return [
            'category default (position)' => [null, ['pcl_yankee', 'pcl_zebra', 'pcl_alpha']],
            'name ascending' => ['name_ascending', ['pcl_alpha', 'pcl_yankee', 'pcl_zebra']],
        ];
    }

    /**
     * @magentoDataFixture Magento_PageBuilder::Test/Integration/_files/category_listing_products.php
     */
    public function testCacheKeyIncludesCategoryAndSortOrder(): void
    {
        $cacheKeyInfo = $this->createBlock('name_ascending')->getCacheKeyInfo();

        $this->assertContains($this->categoryId(), $cacheKeyInfo);
        $this->assertContains('name_ascending', $cacheKeyInfo);
    }

    public function testMissingCategoryProducesAnEmptyCollection(): void
    {
        $block = $this->objectManager->create(
            CategoryListing::class,
            ['data' => ['category_id' => 999999, 'products_count' => 8]]
        );
        $collection = $block->createCollection();
        $collection->load();

        $this->assertSame(0, $collection->getSize());
        $this->assertSame([], $collection->getItems());
    }

    /**
     * @param string|null $sortOrder
     * @return CategoryListing
     */
    private function createBlock(?string $sortOrder): CategoryListing
    {
        $categoryId = $this->categoryId();
        $data = [
            'category_id' => $categoryId,
            'condition_option' => 'category_listing',
            'condition_option_value' => $categoryId,
            'products_count' => 8,
            'show_pager' => 0,
        ];

        if ($sortOrder !== null) {
            $data['sort_order'] = $sortOrder;
        }

        return $this->objectManager->create(CategoryListing::class, ['data' => $data]);
    }

    /**
     * Id of the fixture category
     *
     * @return int
     */
    private function categoryId(): int
    {
        $collection = $this->objectManager->get(CollectionFactory::class)->create();
        $collection->addAttributeToFilter('url_key', self::CATEGORY_URL_KEY);

        return (int)$collection->getFirstItem()->getId();
    }

    /**
     * Ids a category page renders for the fixture category, through ListProduct and Toolbar
     *
     * @param string|null $forcedOrder
     * @return int[]
     */
    private function categoryPageIds(?string $forcedOrder): array
    {
        /** @var Category $category */
        $category = $this->objectManager->create(CategoryRepositoryInterface::class)->get($this->categoryId());

        $registry = $this->objectManager->get(Registry::class);
        $registry->unregister('current_category');
        $registry->register('current_category', $category);

        /** @var Resolver $resolver */
        $resolver = $this->objectManager->get(Resolver::class);
        $resolver->get()->setCurrentCategory($category);

        $layout = $this->objectManager->get(LayoutInterface::class);
        /** @var ListProduct $listProduct */
        $listProduct = $layout->createBlock(ListProduct::class, uniqid('list', true));
        $collection = $listProduct->getLoadedProductCollection();

        $this->applyToolbarSorting($collection, $category, $forcedOrder);

        $ids = [];
        foreach ($collection as $product) {
            $ids[] = (int)$product->getId();
        }

        $registry->unregister('current_category');

        return $ids;
    }

    /**
     * @param Collection $collection
     * @param Category $category
     * @param string|null $forcedOrder
     * @return void
     */
    private function applyToolbarSorting(Collection $collection, Category $category, ?string $forcedOrder): void
    {
        $layout = $this->objectManager->get(LayoutInterface::class);
        /** @var Toolbar $toolbar */
        $toolbar = $layout->createBlock(Toolbar::class, uniqid('toolbar', true));

        $availableOrders = $category->getAvailableSortByOptions();
        if (!$availableOrders) {
            $availableOrders = $this->objectManager->get(Config::class)->getAttributeUsedForSortByArray();
        }
        $toolbar->setAvailableOrders($availableOrders);

        if ($forcedOrder === null) {
            $categorySortBy = $category->getDefaultSortBy();
            if ($categorySortBy && isset($availableOrders[$categorySortBy])) {
                $toolbar->setDefaultOrder($categorySortBy);
            }
        } else {
            $toolbar->setDefaultOrder($forcedOrder);
            $toolbar->setDefaultDirection('asc');
        }

        $toolbar->setCollection($collection);
        $collection->setPageSize(8);
        $collection->setCurPage(1);
    }
}
