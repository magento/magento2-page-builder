<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\TestModulePageBuilderDataMigration\Setup;

use Magento\Framework\Setup\InstallSchemaInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;

class InstallSchema implements InstallSchemaInterface
{
    /**
     * Install tables
     *
     * @param \Magento\Framework\Setup\SchemaSetupInterface $setup
     * @param \Magento\Framework\Setup\ModuleContextInterface $context
     * @throws \Zend_Db_Exception
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function install(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $installer = $setup;

        /**
         * Create table 'gene_bluefoot_entity'
         */
        $table = $installer->getConnection()->newTable(
            $installer->getTable('gene_bluefoot_entity')
        )->addColumn(
            'entity_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['identity' => true, 'unsigned' => true, 'nullable' => false, 'primary' => true],
            'Entity Id'
        )->addColumn(
            'entity_type_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Entity Type Id'
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity', ['entity_type_id']),
            ['entity_type_id']
        )->addColumn(
            'attribute_set_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            5,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Attribute Set Id'
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity', 'attribute_set_id', 'eav_attribute_set', 'attribute_set_id'),
            'attribute_set_id',
            $installer->getTable('eav_attribute_set'),
            'attribute_set_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->addColumn(
            'identifier',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            100,
            ['nullable' => true, 'default' => null],
            'Content Identifier'
        )->addIndex(
            $installer->getIdxName(
                'gene_bluefoot_entity',
                ['identifier'],
                \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE
            ),
            ['identifier'],
            ['type' => \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE]
        )->addColumn(
            'created_at',
            \Magento\Framework\DB\Ddl\Table::TYPE_TIMESTAMP,
            null,
            ['nullable' => false, 'default' => \Magento\Framework\DB\Ddl\Table::TIMESTAMP_INIT],
            'Created At'
        )->addColumn(
            'updated_at',
            \Magento\Framework\DB\Ddl\Table::TYPE_TIMESTAMP,
            null,
            ['nullable' => false, 'default' => \Magento\Framework\DB\Ddl\Table::TIMESTAMP_INIT_UPDATE],
            'Updated At'
        )->setComment(
            'Gene BlueFoot Entity'
        );
        $installer->getConnection()->createTable($table);

        /**
         * Create table 'gene_bluefoot_entity_datetime'
         */
        $table = $installer->getConnection()->newTable(
            $installer->getTable('gene_bluefoot_entity_datetime')
        )->addColumn(
            'value_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['identity' => true, 'nullable' => false, 'primary' => true],
            'Value Id'
        )->addColumn(
            'attribute_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Attribute Id'
        )->addColumn(
            'store_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Store ID'
        )->addColumn(
            'entity_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Entity Id'
        )->addColumn(
            'value',
            \Magento\Framework\DB\Ddl\Table::TYPE_DATETIME,
            null,
            ['nullable' => true, 'default' => null],
            'Value'
        )->addIndex(
            $installer->getIdxName(
                'gene_bluefoot_entity_datetime',
                ['entity_id', 'attribute_id'],
                \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE
            ),
            ['entity_id', 'attribute_id'],
            ['type' => \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE]
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity_datetime', ['attribute_id']),
            ['attribute_id']
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity_datetime', ['entity_id', 'attribute_id', 'value']),
            ['entity_id', 'attribute_id', 'value']
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity_datetime', ['store_id']),
            ['store_id']
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_datetime', 'attribute_id', 'eav_attribute', 'attribute_id'),
            'attribute_id',
            $installer->getTable('eav_attribute'),
            'attribute_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_datetime', 'entity_id', 'gene_bluefoot_entity', 'entity_id'),
            'entity_id',
            $installer->getTable('gene_bluefoot_entity'),
            'entity_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_datetime', 'store_id', 'store', 'store_id'),
            'store_id',
            $installer->getTable('store'),
            'store_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->setComment(
            'Gene BlueFoot Entity Datetime'
        );
        $installer->getConnection()->createTable($table);

        /**
         * Create table 'gene_bluefoot_entity_decimal'
         */
        $table = $installer->getConnection()->newTable(
            $installer->getTable('gene_bluefoot_entity_decimal')
        )->addColumn(
            'value_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['identity' => true, 'nullable' => false, 'primary' => true],
            'Value Id'
        )->addColumn(
            'attribute_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Attribute Id'
        )->addColumn(
            'store_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Store ID'
        )->addColumn(
            'entity_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Entity Id'
        )->addColumn(
            'value',
            \Magento\Framework\DB\Ddl\Table::TYPE_DECIMAL,
            '12,4',
            ['nullable' => false, 'default' => '0.0000'],
            'Value'
        )->addIndex(
            $installer->getIdxName(
                'gene_bluefoot_entity_decimal',
                ['entity_id', 'attribute_id'],
                \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE
            ),
            ['entity_id', 'attribute_id'],
            ['type' => \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE]
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity_decimal', ['attribute_id']),
            ['attribute_id']
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity_decimal', ['entity_id', 'attribute_id', 'value']),
            ['entity_id', 'attribute_id', 'value']
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity_decimal', ['store_id']),
            ['store_id']
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_decimal', 'attribute_id', 'eav_attribute', 'attribute_id'),
            'attribute_id',
            $installer->getTable('eav_attribute'),
            'attribute_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_decimal', 'entity_id', 'gene_bluefoot_entity', 'entity_id'),
            'entity_id',
            $installer->getTable('gene_bluefoot_entity'),
            'entity_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_decimal', 'store_id', 'store', 'store_id'),
            'store_id',
            $installer->getTable('store'),
            'store_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->setComment(
            'Gene BlueFoot Entity Decimal'
        );
        $installer->getConnection()->createTable($table);

        /**
         * Create table 'gene_bluefoot_entity_int'
         */
        $table = $installer->getConnection()->newTable(
            $installer->getTable('gene_bluefoot_entity_int')
        )->addColumn(
            'value_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['identity' => true, 'nullable' => false, 'primary' => true],
            'Value Id'
        )->addColumn(
            'attribute_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Attribute Id'
        )->addColumn(
            'store_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Store ID'
        )->addColumn(
            'entity_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Entity Id'
        )->addColumn(
            'value',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['nullable' => false, 'default' => '0'],
            'Value'
        )->addIndex(
            $installer->getIdxName(
                'gene_bluefoot_entity_int',
                ['entity_id', 'attribute_id'],
                \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE
            ),
            ['entity_id', 'attribute_id'],
            ['type' => \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE]
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity_int', ['attribute_id']),
            ['attribute_id']
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity_int', ['entity_id', 'attribute_id', 'value']),
            ['entity_id', 'attribute_id', 'value']
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity_int', ['store_id']),
            ['store_id']
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_int', 'attribute_id', 'eav_attribute', 'attribute_id'),
            'attribute_id',
            $installer->getTable('eav_attribute'),
            'attribute_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_int', 'entity_id', 'gene_bluefoot_entity', 'entity_id'),
            'entity_id',
            $installer->getTable('gene_bluefoot_entity'),
            'entity_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_int', 'store_id', 'store', 'store_id'),
            'store_id',
            $installer->getTable('store'),
            'store_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->setComment(
            'Gene BlueFoot Entity Int'
        );
        $installer->getConnection()->createTable($table);

        /**
         * Create table 'gene_bluefoot_entity_text'
         */
        $table = $installer->getConnection()->newTable(
            $installer->getTable('gene_bluefoot_entity_text')
        )->addColumn(
            'value_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['identity' => true, 'nullable' => false, 'primary' => true],
            'Value Id'
        )->addColumn(
            'attribute_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Attribute Id'
        )->addColumn(
            'store_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Store ID'
        )->addColumn(
            'entity_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Entity Id'
        )->addColumn(
            'value',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            '64k',
            ['nullable' => false],
            'Value'
        )->addIndex(
            $installer->getIdxName(
                'gene_bluefoot_entity_text',
                ['entity_id', 'attribute_id'],
                \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE
            ),
            ['entity_id', 'attribute_id'],
            ['type' => \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE]
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity_text', ['attribute_id']),
            ['attribute_id']
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity_text', ['store_id']),
            ['store_id']
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_text', 'attribute_id', 'eav_attribute', 'attribute_id'),
            'attribute_id',
            $installer->getTable('eav_attribute'),
            'attribute_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_text', 'entity_id', 'gene_bluefoot_entity', 'entity_id'),
            'entity_id',
            $installer->getTable('gene_bluefoot_entity'),
            'entity_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_text', 'store_id', 'store', 'store_id'),
            'store_id',
            $installer->getTable('store'),
            'store_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->setComment(
            'Gene BlueFoot Entity Text'
        );
        $installer->getConnection()->createTable($table);

        /**
         * Create table 'gene_bluefoot_entity_varchar'
         */
        $table = $installer->getConnection()->newTable(
            $installer->getTable('gene_bluefoot_entity_varchar')
        )->addColumn(
            'value_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['identity' => true, 'nullable' => false, 'primary' => true],
            'Value Id'
        )->addColumn(
            'attribute_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Attribute Id'
        )->addColumn(
            'store_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Store ID'
        )->addColumn(
            'entity_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Entity Id'
        )->addColumn(
            'value',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            [],
            'Value'
        )->addIndex(
            $installer->getIdxName(
                'gene_bluefoot_entity_varchar',
                ['entity_id', 'attribute_id'],
                \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE
            ),
            ['entity_id', 'attribute_id'],
            ['type' => \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE]
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity_varchar', ['attribute_id']),
            ['attribute_id']
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity_varchar', ['entity_id', 'attribute_id', 'value']),
            ['entity_id', 'attribute_id', 'value']
        )->addIndex(
            $installer->getIdxName('gene_bluefoot_entity_varchar', ['store_id']),
            ['store_id']
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_varchar', 'attribute_id', 'eav_attribute', 'attribute_id'),
            'attribute_id',
            $installer->getTable('eav_attribute'),
            'attribute_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_varchar', 'entity_id', 'gene_bluefoot_entity', 'entity_id'),
            'entity_id',
            $installer->getTable('gene_bluefoot_entity'),
            'entity_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_entity_varchar', 'store_id', 'store', 'store_id'),
            'store_id',
            $installer->getTable('store'),
            'store_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->setComment(
            'Gene BlueFoot Entity Varchar'
        );
        $installer->getConnection()->createTable($table);

        /**
         * Create table 'gene_bluefoot_eav_attribute'
         */
        $table = $installer->getConnection()->newTable(
            $installer->getTable('gene_bluefoot_eav_attribute')
        )->addColumn(
            'attribute_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['identity' => false, 'unsigned' => true, 'nullable' => false, 'primary' => true],
            'Attribute Id'
        )->addColumn(
            'is_global',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '1'],
            'Is Global'
        )->addColumn(
            'is_wysiwyg_enabled',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Is WYSIWYG Enabled'
        )->addColumn(
            'is_visible',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '1'],
            'Is Visible'
        )->addColumn(
            'content_scope',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Content Scope'
        )->addColumn(
            'frontend_input_renderer',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            [],
            'Frontend Input Renderer'
        )->addColumn(
            'widget',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            [],
            'Widget'
        )->addColumn(
            'data_model',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'Data Model'
        )->addColumn(
            'template',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            [],
            'Template'
        )->addColumn(
            'list_template',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            [],
            'List Template'
        )->addColumn(
            'additional_data',
            \Magento\Framework\DB\Ddl\Table::TYPE_VARBINARY,
            255,
            [],
            'List Template'
        )->addForeignKey(
            $installer->getFkName('gene_bluefoot_eav_attribute', 'attribute_id', 'eav_attribute', 'attribute_id'),
            'attribute_id',
            $installer->getTable('eav_attribute'),
            'attribute_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->setComment(
            'Gene BlueFoot Eav Attribute'
        );
        $installer->getConnection()->createTable($table);

        /**
         * Create table 'gene_bluefoot_entity_type'
         */
        $table = $installer->getConnection()->newTable(
            $installer->getTable('gene_bluefoot_entity_type')
        )->addColumn(
            'type_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['identity' => true, 'nullable' => false, 'primary' => true],
            'Entity Type Id'
        )->addColumn(
            'identifier',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            100,
            ['nullable' => true, 'default' => null],
            'Content Identifier'
        )->addIndex(
            $installer->getIdxName(
                'gene_bluefoot_entity_type',
                ['identifier'],
                \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE
            ),
            ['identifier'],
            ['type' => \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE]
        )->addColumn(
            'attribute_set_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            5,
            ['unsigned' => true, 'nullable' => false, 'default' => '0'],
            'Attribute Set Id'
        )->addIndex(
            $installer->getIdxName(
                'gene_bluefoot_entity_type',
                ['attribute_set_id'],
                \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE
            ),
            ['attribute_set_id'],
            ['type' => \Magento\Framework\DB\Adapter\AdapterInterface::INDEX_TYPE_UNIQUE]
        )->addForeignKey(
            $installer->getFkName(
                'gene_bluefoot_entity_type',
                'attribute_set_id',
                'eav_attribute_set',
                'attribute_set_id'
            ),
            'attribute_set_id',
            $installer->getTable('eav_attribute_set'),
            'attribute_set_id',
            \Magento\Framework\DB\Ddl\Table::ACTION_CASCADE
        )->addColumn(
            'name',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'Type Name'
        )->addColumn(
            'content_type',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            30,
            ['nullable' => false],
            'Content Type'
        )->addColumn(
            'description',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            '64k',
            ['nullable' => true],
            'Type Description'
        )->addColumn(
            'url_key_prefix',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            80,
            ['nullable' => true],
            'URL Key Prefix'
        )->addColumn(
            'preview_field',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'The field to be shown as a preview if no preview template is defined'
        )->addColumn(
            'renderer',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'Renderer'
        )->addColumn(
            'item_view_template',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'Single Template'
        )->addColumn(
            'list_template',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'List Template'
        )->addColumn(
            'list_item_template',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'List Item Template'
        )->addColumn(
            'item_layout_update_xml',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            null,
            ['nullable' => true],
            'Item Layout Update XML'
        )->addColumn(
            'list_layout_update_xml',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            null,
            ['nullable' => true],
            'List Layout Update XML'
        )->addColumn(
            'singular_name',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'Singular Name'
        )->addColumn(
            'plural_name',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'Plural Name'
        )->addColumn(
            'include_in_sitemap',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['nullable' => false, 'default' => 0],
            'Include In Sitemap'
        )->addColumn(
            'searchable',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['nullable' => false, 'default' => 0],
            'Searchable'
        )->addColumn(
            'icon_class',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            50,
            ['nullable' => true],
            'Icon Class'
        )->addColumn(
            'color',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            11,
            ['nullable' => true],
            'Color'
        )->addColumn(
            'show_in_page_builder',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['nullable' => true, 'default' => 1],
            'Show in Page Builder'
        )->addColumn(
            'sort_order',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['nullable' => true, 'default' => 0, 'unsigned' => true],
            'Sort Order'
        )->setComment(
            'Gene BlueFoot Entity Type'
        );
        $installer->getConnection()->createTable($table);

        /**
         * Create table 'gene_bluefoot_stage_template'
         */
        $table = $installer->getConnection()->newTable(
            $installer->getTable('gene_bluefoot_stage_template')
        )->addColumn(
            'template_id',
            \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
            null,
            ['identity' => true, 'unsigned' => true, 'nullable' => false, 'primary' => true],
            'Template ID'
        )->addColumn(
            'name',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            255,
            ['nullable' => false],
            'Name of template'
        )->addColumn(
            'structure',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            false,
            ['nullable' => false],
            'The JSON page structure'
        )->addColumn(
            'has_data',
            \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
            null,
            ['nullable' => true],
            'Does this template contain data?'
        )->addColumn(
            'preview',
            \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
            false,
            ['nullable' => true],
            'A preview of the page builder structure'
        )->addColumn(
            'pinned',
            \Magento\Framework\DB\Ddl\Table::TYPE_BOOLEAN,
            false,
            ['nullable' => false, 'default' => false],
            'Is the template pinned?'
        )->addColumn(
            'created_at',
            \Magento\Framework\DB\Ddl\Table::TYPE_TIMESTAMP,
            null,
            ['nullable' => false],
            'Created At'
        )->addColumn(
            'updated_at',
            \Magento\Framework\DB\Ddl\Table::TYPE_TIMESTAMP,
            null,
            ['nullable' => false],
            'Updated At'
        );
        $installer->getConnection()->createTable($table);
    }
}
