<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

$objectManager = \Magento\TestFramework\Helper\Bootstrap::getObjectManager();
/* @var \Magento\PageBuilder\Model\Template $template */
$template = $objectManager->create(\Magento\PageBuilder\Model\Template::class);
$template->setName('Test Template')
    ->setPreviewImage('preview-image.jpg')
    ->setCreatedFor('any')
    ->setTemplate('<div data-content-type"row"></div>');

/* @var \Magento\PageBuilder\Model\TemplateRepository $templateRepository */
$templateRepository = $objectManager->create(\Magento\PageBuilder\Model\TemplateRepository::class);
$templateRepository->save($template);
