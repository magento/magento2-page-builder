<?php

namespace Gene\BlueFoot\Model\Attribute\Data\Widget;

use Magento\Catalog\Api\ProductRepositoryInterface;

/**
 * Class Product
 *
 * @package Gene\BlueFoot\Model\Attribute\Data\Widget
 *
 * @author Hob Adams <hob@gene.co.uk>
 */
class Product extends \Gene\BlueFoot\Model\Attribute\Data\AbstractWidget implements \Gene\BlueFoot\Model\Attribute\Data\WidgetInterface
{

    /**
     * @var ProductRepositoryInterface
     */
    protected $_productRepository;

    /**
     * @param \Magento\Framework\Model\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param ProductRepositoryInterface $productRepositoryInterface
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null $resourceCollection
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        ProductRepositoryInterface $productRepositoryInterface,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection);

        $this->_productRepository = $productRepositoryInterface;
    }

    /**
     * Retrieve a product
     *
     * @return \Magento\Catalog\Api\Data\ProductInterface|null
     */
    public function getProduct()
    {
        try {
            $product = $this->_productRepository->getById($this->getEntity()->getData($this->getAttribute()->getData('attribute_code')));
            if ($product->getId()) {
                return $product;
            }
        } catch (\Exception $e) {
            return null;
        }

        return null;
    }

    /**
     * Return an array of basic product data used by the page builder
     *
     * @return array
     */
    public function asJson()
    {
        $product = $this->getProduct();

        return array(
            'name' => $product->getName(),
            'sku' => $product->getSku(),
            /*'image' => $this->_getProductImage(),
            'price' => Mage::helper('core')->currency($product->getFinalPrice(), true, false)*/
        );
    }

}