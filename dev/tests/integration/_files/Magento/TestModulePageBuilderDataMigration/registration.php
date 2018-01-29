<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

use Magento\Framework\Component\ComponentRegistrar;

$registrar = new ComponentRegistrar();
if ($registrar->getPath(ComponentRegistrar::MODULE, 'Magento_TestModulePageBuilderDataMigration') === null) {
    ComponentRegistrar::register(ComponentRegistrar::MODULE, 'Magento_TestModulePageBuilderDataMigration', __DIR__);
}
