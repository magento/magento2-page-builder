<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Block\Entity\PageBuilder\Block\Catalog;

/**
 * Class Gene\BlueFoot\Block\Entity\PageBuilder\Block\Catalog\Category
 *
 */
class Category extends AbstractCatalogBlock
{
    /**
     * Return the product collection
     *
     * @return bool|\Magento\Catalog\Model\CategoryFactory
     */
    public function getProductCollection()
    {
        /* @var $dataModel \Gene\BlueFoot\Model\Attribute\Data\Widget\Category */
        $dataModel = $this->getEntity()->getResource()->getAttribute('category_id')->getDataModel($this->getEntity());
        if ($dataModel instanceof \Gene\BlueFoot\Model\Attribute\Data\Widget\Category &&
            method_exists($dataModel, 'getProductCollection')
        ) {
            return $dataModel->getProductCollection();
        }

        return false;
    }
}
