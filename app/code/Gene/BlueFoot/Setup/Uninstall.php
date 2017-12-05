<?php

namespace Gene\BlueFoot\Setup;

use Magento\Framework\Setup\UninstallInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Magento\Framework\Setup\ModuleContextInterface;

/**
 * Class Uninstall
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Uninstall implements UninstallInterface
{
    public function uninstall(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        // @todo build uninstallation as part of 1.1

        $setup->endSetup();
    }
}
