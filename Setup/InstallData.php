<?php

namespace Gene\BlueFoot\Setup;

use Magento\Framework\Module\Setup\Migration;
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
    private $entitySetupFactory;

    /**
     * Init
     *
     * @param EntitySetupFactory $entitySetupFactory
     */
    public function __construct(EntitySetupFactory $entitySetupFactory)
    {
        $this->entitySetupFactory = $entitySetupFactory;
    }

    /**
     * {@inheritdoc}
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        /** @var \Gene\BlueFoot\Setup\EntitySetup $entitySetup */
        $entitySetup = $this->entitySetupFactory->create(['setup' => $setup]);

        $setup->startSetup();

        // Install the default entities required for the system
        $entitySetup->installEntities();

        $setup->endSetup();
    }

}
