<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Gene\BlueFoot\Block\Adminhtml\ContentType\Edit;

class ButtonFactory
{
    /**
     * Object Manager
     *
     * @var \Magento\Framework\ObjectManagerInterface
     */
    private $objectManager;

    /**
     * Factory constructor.
     *
     * @param \Magento\Framework\ObjectManagerInterface $objectManager
     */
    public function __construct(
        \Magento\Framework\ObjectManagerInterface $objectManager
    ) {
        $this->objectManager = $objectManager;
    }

    /**
     * Create an instance of a model
     *
     * @param $className
     * @param array $data
     *
     * @return \Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface
     * @throws \InvalidArgumentException
     */
    public function create($className, array $data = [])
    {
        $model = $this->objectManager->create($className, $data);

        if (!$model instanceof
            \Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface
        ) {
            throw new \InvalidArgumentException(
                $className . ' doesn\'t implement '
                . '\Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface'
            );
        }
        return $model;
    }
}
