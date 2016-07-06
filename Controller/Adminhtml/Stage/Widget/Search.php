<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Widget;

use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Catalog\Api\ProductRepositoryInterface as ProductRepository;
use Magento\Cms\Api\BlockRepositoryInterface as BlockRepository;

/**
 * Class Search
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Stage\Widget
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Search extends \Magento\Framework\App\Action\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $_resultJsonFactory;

    /**
     * @var \Gene\BlueFoot\Helper\Config
     */
    protected $_configHelper;

    /**
     * @var \Magento\Framework\Api\SearchCriteriaBuilder
     */
    protected $_searchCriteriaBuilder;

    /**
     * @var \Magento\Catalog\Api\ProductRepositoryInterface
     */
    protected $_productRepository;

    /**
     * @var \Magento\Catalog\Model\ResourceModel\Category\CollectionFactory
     */
    protected $_categoryCollectionFactory;

    /**
     * @var \Magento\Cms\Model\ResourceModel\Block\CollectionFactory
     */
    protected $_blockCollectionFactory;

    /**
     * @var \Magento\Framework\Api\FilterBuilder
     */
    protected $_filterBuilder;

    /**
     * Upload constructor.
     *
     * @param \Magento\Framework\App\Action\Context            $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     * @param \Gene\BlueFoot\Helper\Config                     $configHelper
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Gene\BlueFoot\Helper\Config $configHelper,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        ProductRepository $productRepository,
        \Magento\Catalog\Model\ResourceModel\Category\CollectionFactory $categoryCollectionFactory,
        \Magento\Cms\Model\ResourceModel\Block\CollectionFactory $blockCollectionFactory,
        \Magento\Framework\Api\FilterBuilder $filterBuilder,
        \Magento\Framework\Api\Search\FilterGroupBuilder $filterGroupBuilder
    )
    {
        parent::__construct($context);

        $this->_resultJsonFactory = $resultJsonFactory;
        $this->_configHelper = $configHelper;
        $this->_searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->_productRepository = $productRepository;
        $this->_categoryCollectionFactory = $categoryCollectionFactory;
        $this->_blockCollectionFactory = $blockCollectionFactory;
        $this->_filterBuilder = $filterBuilder;
        $this->_filterGroupBuilder = $filterGroupBuilder;
    }

    /**
     * Allow users to search on various things
     *
     * @return $this
     */
    public function execute()
    {
        if ($context = $this->getRequest()->getParam('context')) {
            switch ($context) {
                case 'product':
                    return $this->_searchProduct();
                break;
                case 'category':
                    return $this->_searchCategory();
                break;
                case 'staticblock':
                    return $this->_searchStaticBlock();
                break;
                default:
                    return $this->_resultJsonFactory->create()->setData(['success' => false, 'message' => __('Unable to search on that type')]);
                break;
            }
        }

        return $this->_resultJsonFactory->create()->setData(['success' => false]);
    }

    /**
     * Return the term for the search
     *
     * @return mixed
     */
    protected function _getTerm()
    {
        return $this->getRequest()->getParam('term');
    }

    /**
     * Search for products based on a term
     *
     * @return array
     */
    protected function _searchProduct()
    {
        // Create a filter group, this applies as an OR
        $filterGroups = [];
        $filterGroups[] = $this->_filterGroupBuilder
            ->addFilter($this->_filterBuilder->setField('sku')->setConditionType('like')->setValue('%' . $this->_getTerm() . '%')->create())
            ->addFilter($this->_filterBuilder->setField('name')->setConditionType('like')->setValue('%' . $this->_getTerm() . '%')->create())
            ->create();

        // Build up our search criteria from the groups above
        $searchCriteria = $this->_searchCriteriaBuilder->setFilterGroups($filterGroups);
        $searchCriteria->addFilter('status', 1, 'eq');
        $searchCriteria->addFilter('visibility', [\Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH, \Magento\Catalog\Model\Product\Visibility::VISIBILITY_IN_CATALOG], 'in');

        // Retrieve the products
        $products = $this->_productRepository->getList($searchCriteria->create());

        return $this->_returnOptionArray($products->getItems());
    }

    /**
     * Search for categories based on a term
     *
     * @return array
     */
    protected function _searchCategory()
    {
        $categories = $this->_categoryCollectionFactory->create()
            ->addAttributeToSelect('*')
            ->addAttributeToFilter('name', array('like' => '%' . $this->_getTerm() . '%'));

        return $this->_returnOptionArray($categories);
    }

    /**
     * Search for static blocks based on a term
     *
     * @return array
     */
    protected function _searchStaticBlock()
    {
        $blocks = $this->_blockCollectionFactory->create()
            ->addFieldToSelect('block_id', 'entity_id')
            ->addFieldToSelect('title', 'name')
            ->addFieldToFilter(
                array('title', 'identifier'),
                array(
                    array('like' => '%' . $this->_getTerm() . '%'),
                    array('like' => '%' . $this->_getTerm() . '%'),
                )
            )
            ->addFieldToFilter('is_active', array('eq' => 1));

        return $this->_returnOptionArray($blocks);
    }

    /**
     * Convert results into JSON and return to the user
     *
     * @param        $items
     * @param string $label
     * @param string $id
     *
     * @return $this
     */
    protected function _returnOptionArray($items, $label = 'name', $id = 'entity_id')
    {
        // If the items are a collection, retrieve the items within as an array
        if ($items instanceof \Magento\Framework\Data\Collection\AbstractDb && method_exists($items, 'toArray')) {
            // If the items have not yet been loaded, load them in
            if (!$items->isLoaded()) {
                $items->load();
            }

            $itemsArray = $items->toArray();
            if (isset($itemsArray['items'])) {
                $items = $itemsArray['items'];
            } else {
                $items = $itemsArray;
            }
        }

        $results = [];
        if (is_array($items)) {

            // If there are no results, return no results
            if (count($items) == 0) {
                return $this->_resultJsonFactory->create()->setData(['results' => 0]);
            }

            foreach ($items as $item) {
                $results[] = ['label' => $item[$label] . ' (ID: ' . $item[$id] . ')', 'id' => $item[$id]];
            }
        }

        return $this->_resultJsonFactory->create()->setData($results);
    }

}