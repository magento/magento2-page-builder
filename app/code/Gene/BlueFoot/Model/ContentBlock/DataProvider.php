<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\ContentBlock;

/**
 * We populate our forms in the browser using JavaScript
 */
class DataProvider extends \Magento\Framework\View\Element\UiComponent\DataProvider\DataProvider
{
    /**
     * Return an empty array as data as we populate through the browser
     *
     * @return array
     */
    public function getData()
    {
        return [];
    }
}
