<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Setup\DataConverter;

/**
 * Render individual content types to their new format
 *
 * @api
 */
interface RendererInterface
{
    /**
     * Render HTML for content type
     *
     * @param array $itemData
     * @param array $additionalData
     * @return string
     * @throws \InvalidArgumentException
     * @throws NoSuchEntityException
     */
    public function render(array $itemData, array $additionalData = []) : string;
}
