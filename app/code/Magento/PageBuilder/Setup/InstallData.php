<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup;

use Magento\Framework\Module\FullModuleList;
use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

/**
 * Class InstallData
 */
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
     * Detect if PageBuilder was previously installed and convert data to the new format
     *
     * @param \Magento\Framework\Setup\ModuleDataSetupInterface $setup
     * @param \Magento\Framework\Setup\ModuleContextInterface $context
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        //if ($this->fullModuleList->has('Magento_PageBuilder')) {
            $this->convertBlueFootToPageBuilderFactory->create(['setup' => $setup])->convert();
        //}
    }
}
