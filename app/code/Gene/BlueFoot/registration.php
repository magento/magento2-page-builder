<?php
/**
 * Correctly resolve the module to the document root of the Magento installation.
 * This is required due to the way template validation behaves with symlink'd
 * modules. All templates have to be within the base path of the installation
 * to pass validation, symlink'd files will retain their original path thus
 * failing.
 */
$dir = defined('BP') && strpos(__DIR__, BP) !== 0 ? BP . substr(__DIR__, strlen(dirname(__DIR__, 4))) : __DIR__;

\Magento\Framework\Component\ComponentRegistrar::register(
    \Magento\Framework\Component\ComponentRegistrar::MODULE,
    'Gene_BlueFoot',
    $dir
);