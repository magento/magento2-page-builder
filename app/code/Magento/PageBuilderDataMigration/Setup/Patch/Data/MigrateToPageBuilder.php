<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Setup\Patch\Data;

use Magento\Framework\Setup\Patch\DataPatchInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\PageBuilderDataMigration\Setup\MoveImages;

/**
 * Migrate from BlueFoot to Page Builder
 */
class MigrateToPageBuilder implements DataPatchInterface
{
    /**
     * @var \Magento\PageBuilderDataMigration\Setup\ConvertBlueFootToPageBuilderFactory
     */
    private $convertBlueFootToPageBuilderFactory;

    /**
     * @var ModuleDataSetupInterface $moduleDataSetup
     */
    private $moduleDataSetup;

    /**
     * @var \Magento\Framework\App\State
     */
    private $appState;

    /**
     * @var MoveImages $moveImages
     */
    private $moveImages;

    /**
     * Constructor
     *
     * @param \Magento\PageBuilderDataMigration\Setup\ConvertBlueFootToPageBuilderFactory $factory
     * @param ModuleDataSetupInterface $moduleDataSetup
     * @param \Magento\Framework\App\State $appState
     * @param MoveImages $moveImages
     */
    public function __construct(
        \Magento\PageBuilderDataMigration\Setup\ConvertBlueFootToPageBuilderFactory $factory,
        ModuleDataSetupInterface $moduleDataSetup,
        \Magento\Framework\App\State $appState,
        MoveImages $moveImages
    ) {
        $this->convertBlueFootToPageBuilderFactory = $factory;
        $this->moduleDataSetup = $moduleDataSetup;
        $this->appState = $appState;
        $this->moveImages = $moveImages;
    }

    /**
     * Apply data conversion
     *
     * @return DataPatchInterface|void
     * @throws \Exception
     * @throws \Magento\Framework\Exception\FileSystemException
     */
    public function apply()
    {
        if ($this->moduleDataSetup->tableExists('gene_bluefoot_entity')) {
            $this->updateEavConfiguration();
            $convertBlueFootToPageBuilder = $this->convertBlueFootToPageBuilderFactory->create(
                ['setup' => $this->moduleDataSetup]
            );
            $this->appState->emulateAreaCode(
                \Magento\Framework\App\Area::AREA_ADMINHTML,
                [$convertBlueFootToPageBuilder, 'convert']
            );
            $this->moveImages->move();
        }
    }

    /**
     * @inheritdoc
     */
    public function getAliases()
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public static function getDependencies()
    {
        return [];
    }

    /**
     * Update EAV configuration for entity and attributes
     */
    private function updateEavConfiguration()
    {
        $connection = $this->moduleDataSetup->getConnection();
        $connection->update(
            $this->moduleDataSetup->getTable('eav_entity_type'),
            [
                'entity_model' => \Magento\PageBuilderDataMigration\Model\ResourceModel\Entity::class,
                'attribute_model' => \Magento\PageBuilderDataMigration\Model\Attribute::class,
                'entity_attribute_collection' =>
                    \Magento\PageBuilderDataMigration\Model\ResourceModel\Attribute\Collection::class
            ],
            $connection->quoteInto('entity_type_code = ?', 'gene_bluefoot_entity')
        );

        $entityTypeIdSelect = $connection->select()
            ->from($this->moduleDataSetup->getTable('eav_entity_type'), ['entity_type_id'])
            ->where('entity_type_code = ?', 'gene_bluefoot_entity');
        $entityTypeId = $connection->fetchOne($entityTypeIdSelect);

        $attributeIdsSelect = $connection->select()
            ->from($this->moduleDataSetup->getTable('eav_attribute'), ['attribute_id'])
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
            $this->moduleDataSetup->getTable('gene_bluefoot_eav_attribute'),
            [
                'data_model' => new \Zend_Db_Expr('NULL')
            ],
            $connection->quoteInto('attribute_id IN (?)', $connection->fetchCol($attributeIdsSelect))
        );

        $attributeIdsSelect = $connection->select()
            ->from($this->moduleDataSetup->getTable('eav_attribute'), ['attribute_id'])
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
            $this->moduleDataSetup->getTable('eav_attribute'),
            [
                'source_model' => new \Zend_Db_Expr('NULL')
            ],
            $connection->quoteInto('attribute_id IN (?)', $connection->fetchCol($attributeIdsSelect))
        );
    }
}
