<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Block\ContentType;

class ProductList extends \Magento\Catalog\Block\Product\ListProduct
{
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
