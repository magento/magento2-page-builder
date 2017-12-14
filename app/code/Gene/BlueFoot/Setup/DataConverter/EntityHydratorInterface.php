<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

interface EntityHydratorInterface
{
    /**
     * Hydrate BlueFoot data object with additional data from EAV
     *
     * @param array $data
     * @return array
     */
    public function hydrate(array $data);
}
