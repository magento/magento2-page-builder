<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\Patch\Data;

use Magento\Framework\Setup\Patch\DataPatchInterface;
use Magento\Framework\DB\FieldDataConversionException;
use Magento\PageBuilder\Setup\UpgradeContentHelper;
use Magento\PageBuilder\Setup\Converters\MoveAttribute;

/**
 * Patch is mechanism, that allows to do atomic upgrade data changes
 */
class UpdateContent implements DataPatchInterface
{
    /**
     * @var UpgradeContentHelper
     */
    private $helper;

    /**
     * @param UpgradeContentHelper $helper
     */
    public function __construct(
        UpgradeContentHelper $helper
    ) {
        $this->helper = $helper;
    }

    /**
     * Do Upgrade
     *
     * @return void
     */
    /**
     * @return DataPatchInterface|void
     * @throws FieldDataConversionException
     */
    public function apply()
    {
        $this->helper->upgrade([
            MoveAttribute::class
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function getAliases()
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public static function getDependencies()
    {
        return [];
    }
}
