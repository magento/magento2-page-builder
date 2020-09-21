<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types = 1);

namespace Magento\PageBuilder\Setup\Patch\Data;

use Magento\Framework\DB\FieldDataConversionException;
use Magento\Framework\Setup\Patch\DataPatchInterface;
use Magento\PageBuilder\Setup\Converters\PageBuilderStripStyles;
use Magento\PageBuilder\Setup\UpgradeContentHelper;

/**
 * Patch Upgrade Mechanism for Converting Inline Styles to Internal
 */
class UpgradePageBuilderStripStyles implements DataPatchInterface
{
    /**
     * @var UpgradeContentHelper
     */
    private $helper;

    /**
     * @param UpgradeContentHelper $helper
     */
    public function __construct(UpgradeContentHelper $helper)
    {
        $this->helper = $helper;
    }

    /**
     * Upgrade
     *
     * @return void
     * @throws FieldDataConversionException
     */
    public function apply(): void
    {
        $this->helper->upgrade([
            PageBuilderStripStyles::class
        ]);
    }

    /**
     * @inheritdoc
     */
    public function getAliases(): array
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public static function getDependencies(): array
    {
        return [];
    }
}
