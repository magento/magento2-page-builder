<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

/**
 * Load EAV data from an array of structural item data
 */
interface EavAttributeLoaderInterface
{
    /**
     * Hydrate BlueFoot data object with additional data from EAV
     *
     * @param array $data
     * @return array
     */
    public function load(array $data);
}
