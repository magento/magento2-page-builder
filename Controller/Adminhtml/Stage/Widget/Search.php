<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Widget;

use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Catalog\Api\ProductRepositoryInterface as ProductRepository;

/**
 * Class Search
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Stage\Widget
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Search extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $resultJsonFactory;

    /**
     * @var \Gene\BlueFoot\Helper\Config
     */
    protected $configHelper;

    /**
     * @var \Magento\Framework\Api\SearchCriteriaBuilder
     */
    protected $searchCriteriaBuilder;

    /**
     * @var \Magento\Catalog\Api\ProductRepositoryInterface
     */
    protected $productRepository;

    /**
     * @var \Magento\Catalog\Model\ResourceModel\Category\CollectionFactory
     */
    protected $categoryCollectionFactory;

    /**
     * @var \Magento\Cms\Model\ResourceModel\Block\CollectionFactory
     */
    protected $blockCollectionFactory;

    /**
     * @var \Magento\Framework\Api\FilterBuilder
     */
    protected $filterBuilder;

    /**
     * Search constructor.
     *
     * @param \Magento\Framework\App\Action\Context                           $context
     * @param \Magento\Framework\Controller\Result\JsonFactory                $resultJsonFactory
     * @param \Gene\BlueFoot\Helper\Config                                    $configHelper
     * @param \Magento\Framework\Api\SearchCriteriaBuilder                    $searchCriteriaBuilder
     * @param \Magento\Catalog\Api\ProductRepositoryInterface                 $productRepository
     * @param \Magento\Catalog\Model\ResourceModel\Category\CollectionFactory $categoryCollectionFactory
     * @param \Magento\Cms\Model\ResourceModel\Block\CollectionFactory        $blockCollectionFactory
     * @param \Magento\Framework\Api\FilterBuilder                            $filterBuilder
     * @param \Magento\Framework\Api\Search\FilterGroupBuilder                $filterGroupBuilder
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
    ) {
        parent::__construct($context);

        $this->resultJsonFactory = $resultJsonFactory;
        $this->configHelper = $configHelper;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->productRepository = $productRepository;
        $this->categoryCollectionFactory = $categoryCollectionFactory;
        $this->blockCollectionFactory = $blockCollectionFactory;
        $this->filterBuilder = $filterBuilder;
        $this->filterGroupBuilder = $filterGroupBuilder;
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
                    return $this->searchProduct();
                break;
                case 'category':
                    return $this->searchCategory();
                break;
                case 'staticblock':
                    return $this->searchStaticBlock();
                break;
                default:
                    return $this->resultJsonFactory->create()->setData([
                        'success' => false,
                        'message' => __('Unable to search on that type')
                    ]);
                break;
            }
        }

        return $this->resultJsonFactory->create()->setData(['success' => false]);
    }

    /**
     * Return the term for the search
     *
     * @return mixed
     */
    protected function getTerm()
    {
        return $this->getRequest()->getParam('term');
    }

    /**
     * Search for products based on a term
     *
     * @return array
     */
    protected function searchProduct()
    {
        // Create a filter group, this applies as an OR
        $filterGroups = [];
        $filterGroups[] = $this->filterGroupBuilder
            ->addFilter(
                $this->filterBuilder
                    ->setField('sku')
                    ->setConditionType('like')
                    ->setValue('%' . $this->getTerm() . '%')
                    ->create()
            )
            ->addFilter(
                $this->filterBuilder
                    ->setField('name')
                    ->setConditionType('like')
                    ->setValue('%' . $this->getTerm() . '%')
                    ->create()
            )
            ->create();

        // Build up our search criteria from the groups above
        $searchCriteria = $this->searchCriteriaBuilder->setFilterGroups($filterGroups);
        $searchCriteria->addFilter('status', 1, 'eq');
        $searchCriteria->addFilter('visibility', [
            \Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH,
            \Magento\Catalog\Model\Product\Visibility::VISIBILITY_IN_CATALOG
        ], 'in');

        // Retrieve the products
        $products = $this->productRepository->getList($searchCriteria->create());

        return $this->returnOptionArray($products->getItems());
    }

    /**
     * Search for categories based on a term
     *
     * @return array
     */
    protected function searchCategory()
    {
        $categories = $this->categoryCollectionFactory->create()
            ->addAttributeToSelect('*')
            ->addAttributeToFilter('name', array('like' => '%' . $this->getTerm() . '%'));

        return $this->returnOptionArray($categories);
    }

    /**
     * Search for static blocks based on a term
     *
     * @return array
     */
    protected function searchStaticBlock()
    {
        $blocks = $this->blockCollectionFactory->create()
            ->addFieldToSelect('block_id', 'entity_id')
            ->addFieldToSelect('title', 'name')
            ->addFieldToFilter(
                array('title', 'identifier'),
                array(
                    array('like' => '%' . $this->getTerm() . '%'),
                    array('like' => '%' . $this->getTerm() . '%'),
                )
            )
            ->addFieldToFilter('is_active', array('eq' => 1));

        return $this->returnOptionArray($blocks);
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
    protected function returnOptionArray($items, $label = 'name', $id = 'entity_id')
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
                return $this->resultJsonFactory->create()->setData(['results' => 0]);
            }

            foreach ($items as $item) {
                $results[] = ['label' => $item[$label] . ' (ID: ' . $item[$id] . ')', 'id' => $item[$id]];
            }
        }

        return $this->resultJsonFactory->create()->setData($results);
    }
}
