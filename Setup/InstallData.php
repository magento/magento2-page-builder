<?php

namespace Gene\BlueFoot\Setup;

use Gene\BlueFoot\Api\ContentBlockGroupRepositoryInterface;
use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

/**
 * Class InstallData
 *
 * @package Gene\BlueFoot\Setup
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class InstallData implements InstallDataInterface
{
    /**
     * Entity setup factory
     *
     * @var EntitySetupFactory
     */
    protected $_entitySetupFactory;

    /**
     * Group interface
     *
     * @var \Gene\BlueFoot\Model\Attribute\ContentBlock\GroupFactory
     */
    protected $_groupFactory;

    /**
     * @var \Magento\Framework\Module\Dir\Reader
     */
    protected $_moduleReader;

    /**
     * @var \Magento\Framework\Filesystem\Io\File
     */
    protected $_ioFile;

    /**
     * @var \Gene\BlueFoot\Model\Installer\File
     */
    protected $_fileInstaller;

    /**
     * InstallData constructor.
     *
     * @param \Gene\BlueFoot\Setup\EntitySetupFactory                  $entitySetupFactory
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlock\GroupFactory $groupFactory
     */
    public function __construct(
        EntitySetupFactory $entitySetupFactory,
        \Gene\BlueFoot\Model\Attribute\ContentBlock\GroupFactory $groupFactory,
        \Magento\Framework\Module\Dir\Reader $moduleReader,
        \Magento\Framework\Filesystem\Io\File $ioFile,
        \Gene\BlueFoot\Model\Installer\File $fileInstaller,
        ContentBlockGroupRepositoryInterface $contentBlockGroupRepositoryInterface
    )
    {
        $this->_entitySetupFactory = $entitySetupFactory;
        $this->_groupFactory = $groupFactory;
        $this->_moduleReader = $moduleReader;
        $this->_ioFile = $ioFile;
        $this->_fileInstaller = $fileInstaller;
        $this->_contentBlockGroupRepository = $contentBlockGroupRepositoryInterface;
    }

    /**
     * {@inheritdoc}
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        /** @var \Gene\BlueFoot\Setup\EntitySetup $entitySetup */
        $entitySetup = $this->_entitySetupFactory->create(['setup' => $setup]);

        $setup->startSetup();

        // Install the default entities required for the system
        $entitySetup->installEntities();

        // Create the default groups
        $this->_installGroups();

        // Install the default content blocks
        $this->_installDefaultContentBlocks();

        $setup->endSetup();
    }

    /**
     * Install the default page builder groups
     *
     * @return $this
     */
    protected function _installGroups()
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
            $group = $this->_groupFactory->create();
            $group->setData('code', $code);
            $group->addData($data);
            $this->_contentBlockGroupRepository->save($group);
        }

        return $this;
    }

    /**
     * Install
     *
     * @return $this
     */
    protected function _installDefaultContentBlocks()
    {
        $file = $this->_moduleReader->getModuleDir(false, 'Gene_BlueFoot') . DIRECTORY_SEPARATOR . 'Setup' . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'pagebuilder_blocks_core.json';
        if ($this->_ioFile->fileExists($file)) {
            $this->_fileInstaller->install($file);
        }

        return $this;
    }

}
