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
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        if ($setup->tableExists('gene_bluefoot_entity')) {
            $this->convertBlueFootToPageBuilderFactory->create(['setup' => $setup])->convert();
        }
    }
}
