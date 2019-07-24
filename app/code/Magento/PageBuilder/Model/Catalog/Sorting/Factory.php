<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Catalog\Sorting;

/**
 * Class Factory
 *
 * @package Magento\PageBuilder\Model\Catalog\Sorting
 */
class Factory
{
    /**
     * @var \Magento\Framework\ObjectManagerInterface
     */
    protected $_objectManager;

    /**
     * @param \Magento\Framework\ObjectManagerInterface $objectManager
     */
    public function __construct(\Magento\Framework\ObjectManagerInterface $objectManager)
    {
        $this->_objectManager = $objectManager;
    }

    /**
     * Create instance of sorting class
     *
     * @param string $className
     * @param array $data
     * @return SortInterface
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function create($className, array $data = []): SortInterface
    {
        $instance = $this->_objectManager->create($className, $data);

        if (!$instance instanceof \Magento\PageBuilder\Model\Catalog\Sorting\SortInterface) {
            throw new \Magento\Framework\Exception\LocalizedException(
                __('%1 doesn\'t implement SortInterface', $className)
            );
        }
        return $instance;
    }
}
