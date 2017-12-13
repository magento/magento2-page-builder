<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup;

use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\DB\AggregatedFieldDataConverter;
use Magento\Framework\DB\FieldToConvert;

class ConvertBlueFootToPageBuilder
{
    /**
     * @var AggregatedFieldDataConverter
     */
    private $aggregatedFieldConverter;

    /**
     * @var ModuleDataSetupInterface
     */
    private $setup;

    /**
     * ConvertBlueFootToPageBuilder constructor.
     *
     * @param ModuleDataSetupInterface $setup
     * @param AggregatedFieldDataConverter $aggregatedFieldConverter
     */
    public function __construct(
        ModuleDataSetupInterface $setup,
        AggregatedFieldDataConverter $aggregatedFieldConverter
    ) {
        $this->setup = $setup;
        $this->aggregatedFieldConverter = $aggregatedFieldConverter;
    }

    /**
     * Convert BlueFoot data into Page Builder compatible structures
     */
    public function convert()
    {
        $this->aggregatedFieldConverter->convert(
            [
                new FieldToConvert(
                    DataConverter\BlueFootToPageBuilder::class,
                    $this->setup->getTable('cms_page'),
                    'page_id',
                    'content'
                ),
                new FieldToConvert(
                    DataConverter\BlueFootToPageBuilder::class,
                    $this->setup->getTable('cms_block'),
                    'block_id',
                    'content'
                ),
                new FieldToConvert(
                    DataConverter\BlueFootToPageBuilder::class,
                    $this->setup->getTable('catalog_product_entity_text'),
                    'value_id',
                    'value'
                )
            ],
            $this->setup->getConnection()
        );
    }
}
