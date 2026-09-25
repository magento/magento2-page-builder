<?php
/**
 * Copyright 2025 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Test\Api\GraphQl;

use Magento\Catalog\Model\ResourceModel\Category\Collection;
use Magento\Cms\Api\Data\PageInterface;
use Magento\Cms\Model\PageRepository;
use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\Exception\CouldNotSaveException;
use Magento\Framework\ObjectManagerInterface;
use Magento\TestFramework\Helper\Bootstrap;
use Magento\TestFramework\TestCase\GraphQlAbstract;

class CMSContentProductListingTest extends GraphQlAbstract
{
    /**
     * @var ObjectManagerInterface
     */
    private ObjectManagerInterface $objectManager;

    /**
     * @var SearchCriteriaBuilder
     */
    private SearchCriteriaBuilder $searchCriteriaBuilder;

    /**
     * @var PageRepository
     */
    private PageRepository $pageRepository;

    /**
     * @var Collection
     */
    private Collection $categoryCollection;

    /**
     * @inheritDoc
     */
    protected function setUp(): void
    {
        $this->objectManager = $objectManager = Bootstrap::getObjectManager();
        $this->searchCriteriaBuilder = $objectManager->get(SearchCriteriaBuilder::class);
        $this->pageRepository = $objectManager->get(PageRepository::class);
        $this->categoryCollection = $this->objectManager->get(Collection::class);
    }

    /**
     * Check if product listing is sorted by position
     *
     * @magentoDataFixture Magento/Cms/Fixtures/page_list.php
     * @magentoApiDataFixture Magento/Catalog/_files/category_with_three_products.php
     * @return void
     * @throws CouldNotSaveException
     */
    public function testCMSContentProductListingSortOrder(): void
    {
        $category = $this->categoryCollection->addFieldToFilter(
            'name',
            'Category 999'
        )->getFirstItem();
        $categoryId = $category->getId();
        $content = '<style>#html-body [data-pb-style=E4B30DS]{justify-content:flex-start;display:flex;' .
            'flex-direction:column;background-position:left top;background-size:cover;background-repeat:no-repeat;' .
            'background-attachment:scroll}</style><div data-content-type="row" data-appearance="contained" ' .
            'data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" ' .
            'data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" ' .
            'data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" ' .
            'data-pb-style="E4B30DS"><div data-content-type="products" data-appearance="grid" ' .
            'data-element="main">{{widget type="Magento\CatalogWidget\Block\Product\ProductsList" ' .
            'template="Magento_CatalogWidget::product/widget/content/grid.phtml" anchor_text="" id_path="" ' .
            'show_pager="0" products_count="5" condition_option="category_ids" condition_option_value="' . $categoryId
            .'"type_name="Catalog Products List" conditions_encoded="^[`1`:^[`aggregator`:`all`,`new_child`:``,' .
            '`type`:`Magento||CatalogWidget||Model||Rule||Condition||Combine`,`value`:`1`^],`1--1`:^[`operator`:`==`,' .
            '`type`:`Magento||CatalogWidget||Model||Rule||Condition||Product`,`attribute`:`category_ids`,' .
            '`value`:`' . $categoryId . '`^]^]" sort_order="position"}}</div></div></div>';
        $page = $this->getPageByTitle('Page with 1column layout');
        $page->setContent($content);
        $this->pageRepository->save($page);

        $productPositions = $category->getProductsPosition();
        $products = array_keys($productPositions);
        $index = 2;
        foreach ($products as $product) {
            $productPositions[$product] = $index;
            $index--;
        }

        $category->setPostedProducts($productPositions);
        $category->save();

        $query = $this->getQuery($page->getIdentifier(), ['title', 'content']);
        $response = $this->graphQlQueryWithResponseHeaders($query);
        $position1 = strpos($response['body']['cmsPage']['content'], '/simple-product2.html');
        $position2 = strpos($response['body']['cmsPage']['content'], '/simple-product-with-price-20.html');
        $position3 = strpos($response['body']['cmsPage']['content'], '/simple-product-with-price-10.html');
        $this->assertTrue($position1 < $position2 && $position2 < $position3);
    }

    /**
     * Retrieve a page by its title
     *
     * @param string $title
     * @return PageInterface
     */
    private function getPageByTitle(string $title): PageInterface
    {
        $searchCriteria = $this->searchCriteriaBuilder
            ->addFilter('title', $title)
            ->create();

        $pages = $this->pageRepository->getList($searchCriteria)->getItems();

        /** @var PageInterface $page */
        $page = reset($pages);

        return $page;
    }

    /**
     * Create GraphQL CMS page query
     *
     * @param string $identifier
     * @param array $fields
     * @return string
     */
    private function getQuery(string $identifier, array $fields = ['title']): string
    {
        $fields = implode(PHP_EOL, $fields);

        return <<<QUERY
{
  cmsPage(identifier: "$identifier") {
    $fields
  }
}
QUERY;
    }
}
