<?php
/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

use Magento\Framework\Component\ComponentRegistrar;

$registrar = new ComponentRegistrar();
if ($registrar->getPath(ComponentRegistrar::MODULE, 'Magento_TestModulePageBuilderExtensionPoints') === null) {
    ComponentRegistrar::register(ComponentRegistrar::MODULE, 'Magento_TestModulePageBuilderExtensionPoints', __DIR__);
}
