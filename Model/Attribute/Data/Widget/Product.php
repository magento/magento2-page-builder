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
            'image' => $this->_getProductImage($product),
            'price' => $this->_getFormattedPrice($product->getFinalPrice())
        );
    }

    /**
     * Get formatted Price
     * @param bool|false $price
     * @return string
     */
    protected function _getFormattedPrice($price = false)
    {
        if ($price) {
            $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
            $priceHelper = $objectManager->create('Magento\Framework\Pricing\Helper\Data');
            return $priceHelper->currency($price, true, false);
        }
        return '';
    }

    /**
     * Return the url of the product image
     *
     * @param $product
     * @return string
     */
    protected function _getProductImage($product)
    {

        try{
            //$image = 'category_page_grid' or 'category_page_list';
            $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
            $imageHelper = $objectManager->create('Magento\Catalog\Helper\Image');

            $imgSrc = $imageHelper->init($product, 'category_page_grid')->constrainOnly(FALSE)->keepAspectRatio(TRUE)->keepFrame(FALSE)->resize(200)->getUrl();
        }
        catch(Exception $e) {
            $imgSrc = ''; //Mage::getDesign()->getSkinUrl('images/catalog/product/placeholder/image.jpg',array('_area'=>'frontend'));
        }

        return $imgSrc;
    }

}