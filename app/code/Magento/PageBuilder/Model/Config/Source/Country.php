<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\Pagebuilder\Model\Config\Source;

/**
 * Options provider for countries list
 *
 * @api
 */
class Country implements \Magento\Framework\Option\ArrayInterface
{
    /**
     * Countries
     *
     * @var \Magento\Directory\Model\ResourceModel\Country\Collection
     */
    private $_countryCollection;

    /**
     * Options array
     *
     * @var array
     */
    private $_options;

    /**
     * @param \Magento\Directory\Model\ResourceModel\Country\Collection $countryCollection
     */
    public function __construct(\Magento\Directory\Model\ResourceModel\Country\Collection $countryCollection)
    {
        $this->_countryCollection = $countryCollection;
    }



    /**
     * Return options array
     *
     * @param string|array $foregroundCountries
     * @return array
     */
    public function toOptionArray($foregroundCountries = ''): array
    {
        if (!$this->_options) {
            $this->_options = $this->_countryCollection->loadData()->setForegroundCountries(
                $foregroundCountries
            )->toOptionArray(
                false
            );
        }

        $options = $this->_options;

        for ($i = 0; $i < count($options); $i++) {
            $options[$i]['value'] = $options[$i]['label'];
        }

        return $options;
    }
}
