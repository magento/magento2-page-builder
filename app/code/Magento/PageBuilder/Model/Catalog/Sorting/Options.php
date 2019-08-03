<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting;

/**
 * Class Sorting Options
 */
class Options implements \Magento\Framework\Data\OptionSourceInterface
{
    /**
     * @var \Magento\PageBuilder\Model\Catalog\Sorting
     */
    private $sorting;

    /**
     * @param \Magento\PageBuilder\Model\Catalog\Sorting $sorting
     */
    public function __construct(
        \Magento\PageBuilder\Model\Catalog\Sorting $sorting
    ) {
        $this->sorting = $sorting;
    }

    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        $options = [];
        foreach ($this->sorting->getSortingOptions() as $key => $option) {
            $options[] =
                [
                    'value' => $key,
                    'label' => $option
                ];
        }
        return $options;
    }
}
