<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Model\Catalog\Sorting;

/**
 * Class Sorting Options
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting
 */
class Options implements \Magento\Framework\Data\OptionSourceInterface
{
    /**
     * @var \Magento\PageBuilder\Model\Catalog\Sorting
     */
    private $sorting;

    /**
     * Options constructor.
     *
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
