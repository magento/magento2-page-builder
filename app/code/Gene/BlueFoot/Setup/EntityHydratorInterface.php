<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Gene\BlueFoot\Setup;

interface EntityHydratorInterface
{
    /**
     * @param array $data
     * @return array
     */
    public function hydrate(array $data);
}
