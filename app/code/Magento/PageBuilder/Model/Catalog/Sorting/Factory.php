<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Catalog\Sorting;

/**
 * Class Factory
 */
class Factory
{
    /**
     * @var \Magento\Framework\ObjectManagerInterface
     */
    private $_objectManager;

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
     * @return OptionInterface
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function create($className, array $data = []): OptionInterface
    {
        $instance = $this->_objectManager->create($className, $data);

        if (!$instance instanceof \Magento\PageBuilder\Model\Catalog\Sorting\OptionInterface) {
            throw new \Magento\Framework\Exception\LocalizedException(
                __('%1 doesn\'t implement OptionInterface', $className)
            );
        }
        return $instance;
    }
}
