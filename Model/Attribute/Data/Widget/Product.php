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
     * @var \Magento\Framework\Pricing\Helper\DataFactory
     */
    protected $_pricingHelper;

    /**
     * @var \Magento\Framework\View\LayoutFactory
     */
    protected $_layoutFactory;

    /**
     * Product constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Magento\Catalog\Api\ProductRepositoryInterface              $productRepositoryInterface
     * @param \Magento\Framework\Pricing\Helper\DataFactory                $pricingHelper
     * @param \Magento\Framework\View\LayoutFactory                        $layoutFactory
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        ProductRepositoryInterface $productRepositoryInterface,
        \Magento\Framework\Pricing\Helper\DataFactory $pricingHelper,
        \Magento\Framework\View\LayoutFactory $layoutFactory,
        \Magento\Catalog\Helper\ImageFactory $imageHelperFactory,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection);
        $this->_productRepository = $productRepositoryInterface;
        $this->_pricingHelper = $pricingHelper;
        $this->_layoutFactory = $layoutFactory;
        $this->_imageHelperFactory = $imageHelperFactory;
    }

    /**
     * Retrieve a product
     *
     * @return \Magento\Catalog\Api\Data\ProductInterface|null
     */
    public function getProduct()
    {
        try {
            $product = $this->_productRepository->getById($this->getEntity()->getData($this->getAttribute()->getData('attribute_code')), false, 1);
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
            'image' => $this->_getProductImage($product),
            'price' => $this->_getFormattedPrice($product->getFinalPrice())
        );
    }

    /**
     * Get formatted Price
     * @param bool|float|false $price
     * @return string
     */
    protected function _getFormattedPrice($price = false)
    {
        if ($price !== false) {
            return $this->_pricingHelper->create()->currency($price, true, false);
        }
        return '';
    }

    /**
     * Return the url of the product image
     *
     * @param $product
     * @return string
     */
    protected function _getProductImage(\Magento\Catalog\Model\Product $product)
    {
        try {
            return $this->_imageHelperFactory->create()->init($product, 'bluefoot_product_image_admin')->getUrl();
        } catch (\Exception $e) {
            return '';
        }
    }

}