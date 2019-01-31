<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilderDataMigration\Setup;

use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Cms\Api\Data\BlockInterface;
use Magento\Cms\Api\Data\PageInterface;
use Magento\Framework\EntityManager\MetadataPool;
use Magento\Framework\DB\AggregatedFieldDataConverter;
use Magento\Framework\DB\Select\QueryModifierFactory;
use Magento\Framework\DB\FieldToConvert;
use Magento\PageBuilderDataMigration\Setup\DataConverter\Format;

/**
 * Convert BlueFoot data into PageBuilder
 */
class ConvertBlueFootToPageBuilder
{
    /**
     * @var ModuleDataSetupInterface
     */
    private $setup;

    /**
     * @var MetadataPool
     */
    private $metadataPool;

    /**
     * @var AggregatedFieldDataConverter
     */
    private $aggregatedFieldConverter;

    /**
     * @var QueryModifierFactory
     */
    private $queryModifierFactory;

    /**
     * @param ModuleDataSetupInterface $setup
     * @param MetadataPool $metadataPool
     * @param AggregatedFieldDataConverter $aggregatedFieldConverter
     * @param QueryModifierFactory $queryModifierFactory
     */
    public function __construct(
        ModuleDataSetupInterface $setup,
        MetadataPool $metadataPool,
        AggregatedFieldDataConverter $aggregatedFieldConverter,
        QueryModifierFactory $queryModifierFactory
    ) {
        $this->setup = $setup;
        $this->metadataPool = $metadataPool;
        $this->aggregatedFieldConverter = $aggregatedFieldConverter;
        $this->queryModifierFactory = $queryModifierFactory;
    }

    /**
     * Convert BlueFoot data into Page Builder compatible structures
     *
     * @throws \Exception
     * @throws \Magento\Framework\DB\FieldDataConversionException
     */
    public function convert()
    {
        $pageMetadata = $this->metadataPool->getMetadata(PageInterface::class);
        $blockMetadata = $this->metadataPool->getMetadata(BlockInterface::class);
        $this->aggregatedFieldConverter->convert(
            [
                new FieldToConvert(
                    DataConverter\BlueFootToPageBuilder::class,
                    $this->setup->getTable('cms_page'),
                    $pageMetadata->getIdentifierField(),
                    'content',
                    $this->createQueryModifier('content', Format::BLUEFOOT_KEY)
                ),
                new FieldToConvert(
                    DataConverter\BlueFootToPageBuilder::class,
                    $this->setup->getTable('cms_block'),
                    $blockMetadata->getIdentifierField(),
                    'content',
                    $this->createQueryModifier('content', Format::BLUEFOOT_KEY)
                ),
                new FieldToConvert(
                    DataConverter\BlueFootToPageBuilder::class,
                    $this->setup->getTable('catalog_product_entity_text'),
                    'value_id',
                    'value',
                    $this->createQueryModifier('value', Format::BLUEFOOT_KEY)
                )
            ],
            $this->setup->getConnection()
        );
    }

    /**
     * Create a new query modifier based on a specific field and match string
     *
     * @param string $field
     * @param string $match
     *
     * @return \Magento\Framework\DB\Select\QueryModifierInterface
     */
    private function createQueryModifier($field, $match)
    {
        return $this->queryModifierFactory->create(
            'like',
            [
                'values' => [
                    $field => '%' . $match . '%'
                ]
            ]
        );
    }
}
