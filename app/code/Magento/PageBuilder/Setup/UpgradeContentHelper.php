<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup;

use Magento\Framework\DB\AggregatedFieldDataConverter;
use Magento\Framework\DB\FieldDataConversionException;
use Magento\Framework\DB\FieldToConvert;
use Magento\Framework\DB\Select\QueryModifierFactory;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\PageBuilder\Model\UpgradableEntitiesPool;

/**
 * Helper class to run collection of converters
 */
class UpgradeContentHelper
{
    public const PAGE_BUILDER_CONTENT_PATTERN = '%data-content-type="%';

    /**
     * @var ModuleDataSetupInterface $moduleDataSetup
     */
    private $moduleDataSetup;

    /**
     * @var QueryModifierFactory
     */
    private $queryModifierFactory;

    /**
     * @var UpgradableEntitiesPool
     */
    private $entitiesPool;

    /**
     * @var AggregatedFieldDataConverter
     */
    private $aggregatedFieldDataConverter;

    /**
     * UpgradeContentHelper constructor.
     *
     * @param ModuleDataSetupInterface $moduleDataSetup
     * @param QueryModifierFactory $queryModifierFactory
     * @param UpgradableEntitiesPool $entitiesPool
     * @param AggregatedFieldDataConverter $aggregatedFieldDataConverter
     */
    public function __construct(
        ModuleDataSetupInterface $moduleDataSetup,
        QueryModifierFactory $queryModifierFactory,
        UpgradableEntitiesPool $entitiesPool,
        AggregatedFieldDataConverter $aggregatedFieldDataConverter
    ) {
        $this->moduleDataSetup = $moduleDataSetup;
        $this->queryModifierFactory = $queryModifierFactory;
        $this->entitiesPool = $entitiesPool;
        $this->aggregatedFieldDataConverter = $aggregatedFieldDataConverter;
    }

    /**
     * Executes each specified converter against all upgradable fields in the database
     *
     * @param array $converters
     * @throws FieldDataConversionException
     */
    public function upgrade(array $converters): void
    {
        if (count($converters)) {
            $fields = [];

            foreach ($this->entitiesPool->getEntities() as $tableName => $tableInfo) {
                foreach ($tableInfo['fields'] as $fieldName => $upgradeField) {
                    if (!$upgradeField) {
                        continue;
                    }

                    $queryModifier = $this->queryModifierFactory->create(
                        'like',
                        [
                            'values' => [
                                $fieldName => self::PAGE_BUILDER_CONTENT_PATTERN
                            ]
                        ]
                    );

                    foreach ($converters as $converter) {
                        $fields[] = new FieldToConvert(
                            $converter,
                            $this->moduleDataSetup->getTable($tableName),
                            $tableInfo['identifier'],
                            $fieldName,
                            $queryModifier
                        );
                    }

                }
            }

            $this->aggregatedFieldDataConverter->convert($fields, $this->moduleDataSetup->getConnection());
        }
    }
}
