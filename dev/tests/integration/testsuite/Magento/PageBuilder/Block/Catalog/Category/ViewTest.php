<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block\Catalog\Category;

use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Catalog\Block\Category\View;
use Magento\Framework\Registry;
use Magento\Framework\View\LayoutInterface;
use Magento\TestFramework\Helper\Bootstrap;
use Magento\Catalog\Api\Data\CategoryInterface;
use Magento\Framework\ObjectManagerInterface;
use PHPUnit\Framework\TestCase;

/**
 * @magentoAppArea frontend
 */
class ViewTest extends TestCase
{
    /** @var ObjectManagerInterface */
    private $objectManager;

    /** @var CategoryRepositoryInterface */
    private $categoryRepository;

    /** @var View */
    private $block;

    /** @var LayoutInterface */
    private $layout;

    /** @var Registry */
    private $registry;

    /**
     * @inheritdoc
     */
    protected function setUp(): void
    {
        $this->objectManager = Bootstrap::getObjectManager();
        $this->categoryRepository = $this->objectManager->create(CategoryRepositoryInterface::class);
        $this->registry = $this->objectManager->get(Registry::class);
        $this->layout = $this->objectManager->get(LayoutInterface::class);
    }

    /**
     * Check that PageBuilder category description block contents selector
     *
     * @return void
     * @magentoDataFixture Magento/Catalog/_files/category.php
     */
    public function testDescription(): void
    {
        /** @var CategoryInterface $category */
        $category = $this->categoryRepository->get(333);
        $category->setDescription('This is the description for Category 333 without PageBuilder styles');
        $this->categoryRepository->save($category);
        $this->registerCategory($category);
        $this->block = $this->layout->createBlock(View::class);
        $this->block->setTemplate('Magento_PageBuilder::catalog/category/view/description.phtml');

        $this->assertStringContainsString('data-appearance="contained"', $this->block->toHtml());
    }

    /**
     * Register the category
     *
     * @param CategoryInterface $category
     * @return void
     */
    private function registerCategory(CategoryInterface $category): void
    {
        $this->registry->unregister('current_category');
        $this->registry->register('current_category', $category);
    }
}
