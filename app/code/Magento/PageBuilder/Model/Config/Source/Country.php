<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\Source;

/**
 * Options provider for countries list
 *
 * @api
 */
class Country implements \Magento\Framework\Option\ArrayInterface
{
    /**
     * @var \Magento\Directory\Model\ResourceModel\Country\Collection
     */
    private $countryCollection;

    /**
     * @var array
     */
    private $options;

    /**
     * @param \Magento\Directory\Model\ResourceModel\Country\Collection $countryCollection
     */
    public function __construct(\Magento\Directory\Model\ResourceModel\Country\Collection $countryCollection)
    {
        $this->countryCollection = $countryCollection;
    }

    /**
     * Return options array
     *
     * @return array
     */
    public function toOptionArray(): array
    {
        if (!$this->options) {
            $this->options = $this->countryCollection->loadData()->toOptionArray(false);
            foreach ($this->options as $optionIndex => $optionData) {
                $this->options[$optionIndex]['value'] = $optionData['label'];
            }
        }

        return $this->options;
    }
}
