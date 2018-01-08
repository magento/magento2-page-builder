<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Block\ContentType;

class ProductList extends \Magento\Catalog\Block\Product\ListProduct
{
    /**
     * Constructor
     *
     * @param \Magento\Catalog\Block\Product\Context $context
     * @param \Magento\Framework\Data\Helper\PostHelper $postDataHelper
     * @param \Magento\Catalog\Model\Layer\Resolver $layerResolver
     * @param \Magento\Catalog\Api\CategoryRepositoryInterface $categoryRepository
     * @param \Magento\Framework\Url\Helper\Data $urlHelper
     * @param array $data
     */
    public function __construct(
        \Magento\Catalog\Block\Product\Context $context,
        \Magento\Framework\Data\Helper\PostHelper $postDataHelper,
        \Magento\Catalog\Model\Layer\Resolver $layerResolver,
        \Magento\Catalog\Api\CategoryRepositoryInterface $categoryRepository,
        \Magento\Framework\Url\Helper\Data $urlHelper,
        array $data = []
    ) {
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
        return $this->_getProductCollection();
    }

    /**
     * {@inheritdoc}
     */
    public function getToolbarBlock()
    {
        $toolbar = parent::getToolbarBlock();
        $pageSize = $this->getProductCount() ? $this->getProductCount() : 4;
        if ($pageSize) {
            $toolbar->setData('_current_limit', $pageSize);
        }
        return $toolbar;
    }

    /**
     * {@inheritdoc}
     */
    public function toHtml()
    {
        if ($this->getCategoryId()) {
            try {
                $category = $this->categoryRepository->get($this->getCategoryId());
            } catch (\Magento\Framework\Exception\NoSuchEntityException $e) {
                $category = null;
            }

            if (!$category) {
                return '';
            }
        }
        return parent::toHtml();
    }
}
