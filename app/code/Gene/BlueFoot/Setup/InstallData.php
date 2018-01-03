<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup;

use Gene\BlueFoot\Api\ContentBlockGroupRepositoryInterface;
use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

/**
 * Class InstallData
 */
class InstallData implements InstallDataInterface
{
    /**
     * Entity setup factory
     *
     * @var EntitySetupFactory
     */
    protected $entitySetupFactory;

    /**
     * Group interface
     *
     * @var \Gene\BlueFoot\Model\Attribute\ContentBlock\GroupFactory
     */
    protected $groupFactory;

    /**
     * @var \Magento\Framework\Module\Dir\Reader
     */
    protected $moduleReader;

    /**
     * @var \Magento\Framework\Filesystem\Io\File
     */
    protected $ioFile;

    /**
     * @var \Gene\BlueFoot\Model\Installer\File
     */
    protected $fileInstaller;

    /**
     * @var \Magento\Eav\Model\Config
     */
    protected $eavConfig;

    /**
     * @var \Gene\BlueFoot\Api\ContentBlockGroupRepositoryInterface
     */
    protected $contentBlockGroupRepository;

    /**
     * InstallData constructor.
     *
     * @param \Gene\BlueFoot\Setup\EntitySetupFactory                  $entitySetupFactory
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlock\GroupFactory $groupFactory
     * @param \Magento\Framework\Module\Dir\Reader                     $moduleReader
     * @param \Magento\Framework\Filesystem\Io\File                    $ioFile
     * @param \Gene\BlueFoot\Model\Installer\File                      $fileInstaller
     * @param \Gene\BlueFoot\Api\ContentBlockGroupRepositoryInterface  $contentBlockGroupRepositoryInterface
     * @param \Magento\Eav\Model\Config                                $eavConfig
     */
    public function __construct(
        EntitySetupFactory $entitySetupFactory,
        \Gene\BlueFoot\Model\Attribute\ContentBlock\GroupFactory $groupFactory,
        \Magento\Framework\Module\Dir\Reader $moduleReader,
        \Magento\Framework\Filesystem\Io\File $ioFile,
        \Gene\BlueFoot\Model\Installer\File $fileInstaller,
        ContentBlockGroupRepositoryInterface $contentBlockGroupRepositoryInterface,
        \Magento\Eav\Model\Config $eavConfig
    ) {
        $this->entitySetupFactory = $entitySetupFactory;
        $this->groupFactory = $groupFactory;
        $this->moduleReader = $moduleReader;
        $this->ioFile = $ioFile;
        $this->fileInstaller = $fileInstaller;
        $this->contentBlockGroupRepository = $contentBlockGroupRepositoryInterface;
        $this->eavConfig = $eavConfig;
    }

    /**
     * Install groups and entities
     *
     * @param \Magento\Framework\Setup\ModuleDataSetupInterface $setup
     * @param \Magento\Framework\Setup\ModuleContextInterface   $context
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        /** @var \Gene\BlueFoot\Setup\EntitySetup $entitySetup */
        $entitySetup = $this->entitySetupFactory->create(['setup' => $setup]);

        // Run a fresh installation if no previous version is present
        $setup->startSetup();
        $entitySetup->installEntities();
        $entitySetup->cleanCache();

        // Clear the eavConfig cache
        $this->eavConfig->clear();

        // Create the default groups
        $this->installGroups();

        // Install the default content blocks
        $this->installDefaultContentBlocks($setup);

        $setup->endSetup();
    }

    /**
     * Install the default page builder groups
     *
     * @return $this
     */
    protected function installGroups()
    {
        $groups = [
            'general' => [
                'icon' => '<i class="fa fa-chevron-down"></i>',
                'name' => 'General',
                'sort_order' => 10
            ],
            'media' => [
                'icon' => '<i class="fa fa-chevron-down"></i>',
                'name' => 'Media',
                'sort_order' => 20
            ],
            'commerce' => [
                'icon' => '<i class="fa fa-chevron-down"></i>',
                'name' => 'Commerce',
                'sort_order' => 30
            ],
            'other' => [
                'icon' => '<i class="fa fa-chevron-down"></i>',
                'name' => 'Other',
                'sort_order' => 40
            ]
        ];

        // Iterate through creating the base groups
        foreach ($groups as $code => $data) {
            $group = $this->groupFactory->create();
            $group->setData('code', $code);
            $group->addData($data);
            $this->contentBlockGroupRepository->save($group);
        }

        return $this;
    }

    /**
     * Install
     *
     * @return $this
     */
    protected function installDefaultContentBlocks($setup)
    {
        $file = $this->moduleReader->getModuleDir(false, 'Gene_BlueFoot') . DIRECTORY_SEPARATOR .
            'Setup' . DIRECTORY_SEPARATOR .
            'data' . DIRECTORY_SEPARATOR .
            'pagebuilder_blocks_core.json';

        if ($this->ioFile->fileExists($file)) {
            $this->fileInstaller->install($file, $setup);
        }

        return $this;
    }
}
