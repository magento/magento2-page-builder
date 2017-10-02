<?php
/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\ContentBlock;

/**
 * Class DataProvider
 *
 * We populate our forms in the browser using JavaScript
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
class DataProvider extends \Magento\Ui\DataProvider\AbstractDataProvider
{
    /**
     * @return AbstractCollection
     */
    public function getCollection()
    {
        return $this->collection;
    }

    /**
     * Get meta
     *
     * @return array
     */
    public function getMeta()
    {
        return [];
    }

    /**
     * Get data
     *
     * @return array
     */
    public function getData()
    {
        return [];
    }
}
