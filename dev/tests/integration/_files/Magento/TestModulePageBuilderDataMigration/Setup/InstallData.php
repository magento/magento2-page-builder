<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\TestModulePageBuilderDataMigration\Setup;

use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

class InstallData implements InstallDataInterface
{
    /**
     * Entity setup factory
     *
     * @var EntitySetupFactory
     */
    private $entitySetupFactory;

    /**
     * @var \Magento\TestModulePageBuilderDataMigration\Model\Install
     */
    private $installer;

    /**
     * @var \Magento\Eav\Model\Config
     */
    private $eavConfig;

    /**
     * @var \Magento\Framework\Filesystem\Io\File
     */
    private $file;

    /**
     * @var \Magento\Framework\Module\Dir\Reader
     */
    private $moduleReader;

    /**
     * Constructor
     *
     * @param EntitySetupFactory $entitySetupFactory
     * @param \Magento\TestModulePageBuilderDataMigration\Model\Install $installer
     * @param \Magento\Eav\Model\Config $eavConfig
     * @param \Magento\Framework\Module\Dir\Reader $reader
     * @param \Magento\Framework\Filesystem\Io\File $file
     */
    public function __construct(
        \Magento\TestModulePageBuilderDataMigration\Setup\EntitySetupFactory $entitySetupFactory,
        \Magento\TestModulePageBuilderDataMigration\Model\Install $installer,
        \Magento\Eav\Model\Config $eavConfig,
        \Magento\Framework\Module\Dir\Reader $moduleReader,
        \Magento\Framework\Filesystem\Io\File $file
    ) {
        $this->entitySetupFactory = $entitySetupFactory;
        $this->installer = $installer;
        $this->eavConfig = $eavConfig;
        $this->moduleReader = $moduleReader;
        $this->file = $file;
    }

    /**
     * Install groups and entities
     *
     * @param \Magento\Framework\Setup\ModuleDataSetupInterface $setup
     * @param \Magento\Framework\Setup\ModuleContextInterface $context
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        /** @var \Magento\TestModulePageBuilderDataMigration\Setup\EntitySetup $entitySetup */
        $entitySetup = $this->entitySetupFactory->create(['setup' => $setup]);

        // Run a fresh installation if no previous version is present
        $entitySetup->installEntities();
        $entitySetup->cleanCache();

        // Clear the eavConfig cache
        $this->eavConfig->clear();

        // Install the default content blocks
        $this->installDefaultContentBlocks($setup);

        $setup->endSetup();
    }

    /**
     * Install
     *
     * @param \Magento\Framework\Setup\ModuleDataSetupInterface $setup
     */
    private function installDefaultContentBlocks($setup)
    {
        $filePath = $this->moduleReader->getModuleDir(false, 'Magento_TestModulePageBuilderDataMigration')
            . DIRECTORY_SEPARATOR
            . 'Setup'
            . DIRECTORY_SEPARATOR
            . 'install_data.json';
        $data = json_decode($this->file->read($filePath), true);
        $this->installer->install($data, $setup);
    }
}
