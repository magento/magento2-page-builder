<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Setup\DataConverter;

use Magento\Framework\Exception\NoSuchEntityException;

/**
 * Load EAV data from an array of structural item data
 *
 * @api
 */
interface EavAttributeLoaderInterface
{
    /**
     * Hydrate PageBuilder data object with additional data from EAV
     *
     * @param int $entityId
     * @return array
     * @throws NoSuchEntityException
     */
    public function load($entityId) : array;
}
