<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder\Block\Catalog;

/**
 * Class Gene\BlueFoot\Block\Entity\PageBuilder\Block\Catalog\Single
 *
 * @author Hob Adams <hob@gene.co.uk>
 */
class Single extends AbstractCatalogBlock
{
    /**
     * Return the product
     *
     * @return bool|\Magento\Catalog\Api\Data\ProductInterface|null
     */
    public function getProduct()
    {
        /* @var $dataModel \Gene\BlueFoot\Model\Attribute\Data\Widget\Product */
        $dataModel = $this->getEntity()->getResource()->getAttribute('product_id')->getDataModel($this->getEntity());
        if ($dataModel instanceof \Gene\BlueFoot\Model\Attribute\Data\Widget\Product &&
            method_exists($dataModel, 'getProduct')
        ) {
            return $dataModel->getProduct();
        }

        return false;
    }
}
