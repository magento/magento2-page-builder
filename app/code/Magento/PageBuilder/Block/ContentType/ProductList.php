<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Block\ContentType;

use Magento\Catalog\Api\CategoryRepositoryInterface;

class ProductList extends \Magento\Catalog\Block\Product\ListProduct
{
    /*
     * Default value set in pagebuilder_products_list_form.xml
     */
    const DEFAULT_NUMBER_OF_PRODUCTS_DISPLAYED = 4;

    /**
     * Product collection factory
     *
     * @var \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory
     */
    private $productCollectionFactory;

    /**
     * @param \Magento\Catalog\Block\Product\Context $context
     * @param \Magento\Framework\Data\Helper\PostHelper $postDataHelper
     * @param \Magento\Catalog\Model\Layer\Resolver $layerResolver
     * @param CategoryRepositoryInterface $categoryRepository
     * @param \Magento\Framework\Url\Helper\Data $urlHelper
     * @param \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory $productCollectionFactory
     * @param array $data
     */
    public function __construct(
        \Magento\Catalog\Block\Product\Context $context,
        \Magento\Framework\Data\Helper\PostHelper $postDataHelper,
        \Magento\Catalog\Model\Layer\Resolver $layerResolver,
        CategoryRepositoryInterface $categoryRepository,
        \Magento\Framework\Url\Helper\Data $urlHelper,
        \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory $productCollectionFactory,
        array $data = []
    ) {
        $this->productCollectionFactory = $productCollectionFactory;
        parent::__construct(
            $context,
            $postDataHelper,
            $layerResolver,
            $categoryRepository,
            $urlHelper,
            $data
        );
    }

    /**
     * {@inheritdoc}
     */
    public function getProductCollection()
    {
        if ($this->getCategoryId()) {
            /** @var \Magento\Catalog\Model\ResourceModel\Product\Collection $collection */
            $collection = $this->productCollectionFactory->create();
            $this->_catalogLayer->prepareProductCollection($collection);
            $collection->getSelect()->orderRand();
            $collection->addCategoryFilter($this->getCategory());
            $collection->addStoreFilter();
            $numProductsToDisplay = $this->getData('product_count') ?? self::DEFAULT_NUMBER_OF_PRODUCTS_DISPLAYED;
            $collection->setPage(1, $numProductsToDisplay);
            $this->setCollection($collection);
        }

        return $this->_getProductCollection();
    }

    /**
     * {@inheritdoc}
     */
    public function getToolbarBlock()
    {
        $toolbar = parent::getToolbarBlock();
        $numProductsToDisplay = $this->getData('product_count') ?? self::DEFAULT_NUMBER_OF_PRODUCTS_DISPLAYED;
        if ($numProductsToDisplay) {
            $toolbar->setData('_current_limit', $numProductsToDisplay);
        }
        return $toolbar;
    }

    /**
     * {@inheritdoc}
     */
    public function toHtml()
    {
        return $this->getCategory() ? parent::toHtml() : '';
    }

    /**
     * Retrieves category based on category id field
     *
     * @return null|\Magento\Catalog\Api\Data\CategoryInterface
     */
    private function getCategory()
    {
        $category = null;
        if ($this->getCategoryId()) {
            try {
                $category = $this->categoryRepository->get($this->getCategoryId());
            } catch (\Magento\Framework\Exception\NoSuchEntityException $e) {
            }
        }

        return $category;
    }
}
