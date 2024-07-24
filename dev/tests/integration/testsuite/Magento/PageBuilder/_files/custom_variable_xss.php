<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

$objectManager = \Magento\TestFramework\Helper\Bootstrap::getObjectManager();

/** @var \Magento\Variable\Model\ResourceModel\Variable $variableResource */
$variableResource = $objectManager->get(\Magento\Variable\Model\ResourceModel\Variable::class);

/** @var \Magento\Variable\Model\Variable $variable */
$variable = $objectManager->get(\Magento\Variable\Model\Variable::class);

$variable->setData([
    'code' => 'xssVariable',
    'name' => 'xssVariable',
    'html_value' => '<img src=x onerror="alert(0)">',
    'plain_value' => '<img src=x onerror="alert(0)">',
]);

$variableResource->save($variable);
