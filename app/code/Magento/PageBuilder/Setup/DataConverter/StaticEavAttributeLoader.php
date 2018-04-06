<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Setup\DataConverter;

use Magento\PageBuilder\Model\EntityFactory;
use Magento\PageBuilder\Model\AttributeFactory;
use Magento\Framework\Exception\NoSuchEntityException;

class StaticEavAttributeLoader implements EavAttributeLoaderInterface
{
    /**
     * @var array
     */
    private $eavData;

    /**
     * StaticEavAttributeLoader constructor.
     *
     * @param array $eavData
     */
    public function __construct(
        array $eavData = []
    ) {
        $this->eavData = $eavData;
    }

    /**
     * @inheritdoc
     */
    public function load($entityId)
    {
        if (isset($this->eavData[$entityId])) {
            return $this->eavData[$entityId];
        }

        return [];
    }
}
