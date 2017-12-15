<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup;

use Magento\Framework\Module\FullModuleList;
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
     * @var FullModuleList
     */
    private $fullModuleList;

    /**
     * InstallData constructor.
     *
     * @param ConvertBlueFootToPageBuilderFactory $convertBlueFootToPageBuilderFactory
     * @param FullModuleList $fullModuleList
     */
    public function __construct(
        ConvertBlueFootToPageBuilderFactory $convertBlueFootToPageBuilderFactory,
        FullModuleList $fullModuleList
    ) {
        $this->convertBlueFootToPageBuilderFactory = $convertBlueFootToPageBuilderFactory;
        $this->fullModuleList = $fullModuleList;
    }

    /**
     * Detect if BlueFoot was previously installed and convert any data to our new format
     *
     * @param \Magento\Framework\Setup\ModuleDataSetupInterface $setup
     * @param \Magento\Framework\Setup\ModuleContextInterface   $context
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        if ($this->fullModuleList->has('Gene_BlueFoot')) {
            $this->convertBlueFootToPageBuilderFactory->create(['setup' => $setup])
                ->convert();
        }

        $setup->endSetup();
    }
}
