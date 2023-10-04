<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Model\Catalog;

use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Catalog\Model\ResourceModel\Product\CollectionFactory;
use Magento\CatalogWidget\Model\Rule;
use Magento\Framework\App\ResourceConnection;
use Magento\Framework\DB\Adapter\AdapterInterface;
use Magento\Framework\DB\Select;
use Magento\Framework\EntityManager\EntityMetadataInterface;
use Magento\Framework\EntityManager\MetadataPool;
use Magento\PageBuilder\Model\Catalog\ProductTotals;
use Magento\Rule\Model\Condition\Combine;
use Magento\Rule\Model\Condition\Sql\Builder;
use Magento\Widget\Helper\Conditions;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class ProductTotalsTest extends TestCase
{
    /**
     * @var CollectionFactory|MockObject
     */
    private CollectionFactory $productCollectionFactory;

    /**
     * @var Builder|MockObject
     */
    private Builder $sqlBuilder;

    /**
     * @var Rule|MockObject
     */
    private Rule $rule;

    /**
     * @var Conditions|MockObject
     */
    private Conditions $conditionsHelper;

    /**
     * @var CategoryRepositoryInterface|MockObject
     */
    private CategoryRepositoryInterface $categoryRepository;

    /**
     * @var MetadataPool|MockObject
     */
    private MetadataPool $metadataPool;

    /**
     * @var ResourceConnection|MockObject
     */
    private ResourceConnection $resource;

    /**
     * @var ProductTotals|MockObject
     */
    private ProductTotals $productTotals;

    /**
     * @inheritdoc
     */
    protected function setUp(): void
    {
        $this->productCollectionFactory = $this->createMock(CollectionFactory::class);
        $this->sqlBuilder = $this->createMock(Builder::class);
        $this->rule = $this->createMock(Rule::class);
        $this->conditionsHelper = $this->createMock(Conditions::class);
        $this->categoryRepository = $this->createMock(CategoryRepositoryInterface::class);
        $this->metadataPool = $this->createMock(MetadataPool::class);
        $this->resource = $this->createMock(ResourceConnection::class);

        $this->productTotals = new ProductTotals(
            $this->productCollectionFactory,
            $this->sqlBuilder,
            $this->rule,
            $this->conditionsHelper,
            $this->categoryRepository,
            $this->metadataPool,
            $this->resource
        );

        parent::setUp();
    }

    /**
     * @return void
     * @throws \Magento\Framework\Exception\LocalizedException
     * @throws \Zend_Db_Select_Exception
     */
    public function testGetProductTotals(): void
    {
        $collection = $this->createMock(Collection::class);
        $collection->expects($this->exactly(3))->method('distinct');
        $collection->expects($this->any())->method('addAttributeToFilter');
        $collection->expects($this->exactly(3))->method('getAllIds');
        $collection->expects($this->any())->method('getSize')->willReturn(1);
        $select = $this->createMock(Select::class);
        $select->expects($this->any())->method('joinLeft')->willReturn($select);

        $collection->expects($this->exactly(3))->method('getSelect')->willReturn($select);
        $this->productCollectionFactory->expects($this->any())
            ->method('create')
            ->willReturn($collection);

        $entityMeta = $this->createMock(EntityMetadataInterface::class);
        $entityMeta->expects($this->exactly(3))->method('getLinkField')->willReturn('row_id');
        $this->metadataPool->expects($this->exactly(3))
            ->method('getMetadata')
            ->with(\Magento\Catalog\Api\Data\ProductInterface::class)
            ->willReturn($entityMeta);

        $parentSelect = $this->createMock(Select::class);
        $parentSelect->expects($this->any())->method('from')->willReturn($parentSelect);
        $parentSelect->expects($this->any())->method('joinInner')->willReturn($parentSelect);
        $db = $this->createMock(AdapterInterface::class);
        $db->expects($this->exactly(3))->method('select')->willReturn($parentSelect);
        $db->expects($this->exactly(3))->method('fetchCol')->willReturn([1]);
        $this->resource->expects($this->exactly(3))->method('getConnection')->willReturn($db);

        $this->conditionsHelper->expects($this->exactly(3))->method('decode')->willReturn([]);
        $this->rule->expects($this->exactly(3))->method('loadPost');
        $combine = $this->createMock(Combine::class);
        $this->rule->expects($this->exactly(3))->method('getConditions')->willReturn($combine);

        $this->productTotals->getProductTotals('{conditions}');
    }
}
