<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup;

use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

class InstallData implements InstallDataInterface
{
    /**
     * @var ConvertBlueFootToPageBuilderFactory
     */
    private $convertBlueFootToPageBuilderFactory;

    /**
     * Constructor
     *
     * @param ConvertBlueFootToPageBuilderFactory $convertBlueFootToPageBuilderFactory
     */
    public function __construct(
        ConvertBlueFootToPageBuilderFactory $convertBlueFootToPageBuilderFactory
    ) {
        $this->convertBlueFootToPageBuilderFactory = $convertBlueFootToPageBuilderFactory;
    }

    /**
     * Detect if PageBuilder was previously installed and convert data to the new format
     *
     * @param \Magento\Framework\Setup\ModuleDataSetupInterface $setup
     * @param \Magento\Framework\Setup\ModuleContextInterface $context
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        if ($setup->tableExists('gene_bluefoot_entity')) {
            $this->updateEavConfiguration($setup->getConnection());
            $this->convertBlueFootToPageBuilderFactory->create(['setup' => $setup])->convert();
        }
    }

    /**
     * Update EAV configuration for entity and attributes
     *
     * @param \Magento\Framework\DB\Adapter\AdapterInterface $connection
     */
    private function updateEavConfiguration($connection)
    {
        $connection->update(
            'eav_entity_type',
            [
                'entity_model' => \Magento\PageBuilder\Model\ResourceModel\Entity::class,
                'attribute_model' => \Magento\PageBuilder\Model\Attribute::class,
                'entity_attribute_collection' => \Magento\PageBuilder\Model\ResourceModel\Attribute\Collection::class
            ],
            $connection->quoteInto('entity_type_code = ?', 'gene_bluefoot_entity')
        );

        $entityTypeIdSelect = $connection->select()
            ->from('eav_entity_type', ['entity_type_id'])
            ->where('entity_type_code = ?', 'gene_bluefoot_entity');
        $entityTypeId = $connection->fetchOne($entityTypeIdSelect);

        $attributeIdsSelect = $connection->select()
            ->from('eav_attribute', ['attribute_id'])
            ->where(
                'attribute_code IN (?)',
                [
                    'block_id',
                    'category_id',
                    'product_id',
                    'map',
                    'video_url'
                ]
            )
            ->where('entity_type_id = ?', $entityTypeId);
        $connection->update(
            'gene_bluefoot_eav_attribute',
            [
                'data_model' => new \Zend_Db_Expr('NULL')
            ],
            $connection->quoteInto('attribute_id IN (?)', $connection->fetchCol($attributeIdsSelect))
        );

        $attributeIdsSelect = $connection->select()
            ->from('eav_attribute', ['attribute_id'])
            ->where(
                'attribute_code IN (?)',
                [
                    'advanced_slider_items',
                    'button_items',
                    'slider_items',
                    'accordion_items',
                    'tabs_items'
                ]
            )
            ->where('entity_type_id = ?', $entityTypeId);
        $connection->update(
            'eav_attribute',
            [
                'source_model' => new \Zend_Db_Expr('NULL')
            ],
            $connection->quoteInto('attribute_id IN (?)', $connection->fetchCol($attributeIdsSelect))
        );
    }
}
