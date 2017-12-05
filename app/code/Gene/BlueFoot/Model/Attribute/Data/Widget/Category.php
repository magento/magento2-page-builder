<?php

namespace Gene\BlueFoot\Model\Attribute\Data\Widget;

use Magento\Catalog\Api\ProductRepositoryInterface;

/**
 * Class Category
 *
 * @package Gene\BlueFoot\Model\Attribute\Data\Widget
 *
 * @author Hob Adams <hob@gene.co.uk>
 */
class Category extends \Gene\BlueFoot\Model\Attribute\Data\AbstractWidget implements
    \Gene\BlueFoot\Model\Attribute\Data\WidgetInterface
{

    /**
     * @var ProductRepositoryInterface
     */
    protected $productRepository;

    /**
     * @var \Magento\Catalog\Model\CategoryFactory
     */
    protected $categoryFactory;

    /**
     * @var \Magento\Framework\Pricing\Helper\DataFactory
     */
    protected $pricingHelper;

    /**
     * @var \Magento\Catalog\Helper\ImageFactory
     */
    protected $imageHelperFactory;

    /**
     * Category constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Magento\Catalog\Api\ProductRepositoryInterface              $productRepositoryInterface
     * @param \Magento\Catalog\Model\CategoryFactory                       $categoryFactory
     * @param \Magento\Framework\Pricing\Helper\DataFactory                $pricingHelper
     * @param \Magento\Catalog\Helper\ImageFactory                         $imageHelperFactory
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        ProductRepositoryInterface $productRepositoryInterface,
        \Magento\Catalog\Model\CategoryFactory $categoryFactory,
        \Magento\Framework\Pricing\Helper\DataFactory $pricingHelper,
        \Magento\Catalog\Helper\ImageFactory $imageHelperFactory,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection);
        $this->productRepository = $productRepositoryInterface;
        $this->categoryFactory = $categoryFactory;
        $this->pricingHelper = $pricingHelper;
        $this->imageHelperFactory = $imageHelperFactory;
    }

    /**
     * Load a category based on the data set in the field
     *
     * @return bool|\Magento\Catalog\Model\Category
     */
    public function getCategory()
    {
        if ($categoryId = $this->getEntity()->getData($this->getAttribute()->getData('attribute_code'))) {
            /* @var $category \Magento\Catalog\Model\Category */
            $category = $this->categoryFactory->create()->load($categoryId);
            return $category;
        }
        return false;
    }

    /**
     * Retrieve the product collection
     *
     * @return bool|\Magento\Framework\Data\Collection\AbstractDb
     */
    public function getProductCollection()
    {
        $pageSize = ($this->getEntity()->getProductCount()) ? $this->getEntity()->getProductCount() : 4 ;
        if ($this->getCategory()) {
            return $this->getCategory()
                ->getProductCollection()
                ->setPageSize($pageSize)
                ->setCurPage(1)
                ->addAttributeToSelect('*');
        }

        return false;
    }

    /**
     * Return an array of basic product data used by the page builder
     *
     * @return array
     */
    public function asJson()
    {
        $return = [];
        $collection = $this->getProductCollection();
        $category = $this->getCategory();

        // Add category name if it's present
        if ($category) {
            $return['category'] = ['name' => $category->getName()];
        }

        // Load products for the category
        if (!$collection) {
            return $return;
        }

        foreach ($collection as $product) {
            $return['products'][] = [
                'name' => $product->getName(),
                'sku' => $product->getSku(),
                'image' => $this->getProductImage($product),
                'price' => $this->getFormattedPrice($product->getFinalPrice())
            ];
        }

        return $return;
    }

    /**
     * Get formatted Price
     *
     * @param bool|float|false $price
     * @return string
     */
    protected function getFormattedPrice($price = false)
    {
        if ($price !== false) {
            return $this->pricingHelper->create()->currency($price, true, false);
        }
        return '';
    }

    /**
     * Return the url of the product image
     *
     * @param $product
     * @return string
     */
    protected function getProductImage(\Magento\Catalog\Model\Product $product)
    {
        try {
            return $this->imageHelperFactory->create()->init($product, 'bluefoot_product_image_admin')->getUrl();
        } catch (\Exception $e) {
            return '';
        }
    }
}
