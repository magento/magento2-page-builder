<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Observer;

use Magento\Framework\Event\ObserverInterface;

class AddPageBuilderAttributeTypeObserver implements ObserverInterface
{
    /**
     * PageBuilder config
     *
     * @var \Magento\PageBuilder\Model\Config
     */
    private $config;

    /**
     * @param \Magento\PageBuilder\Model\Config $config
     */
    public function __construct(\Magento\PageBuilder\Model\Config $config)
    {
        $this->config = $config;
    }

    /**
     * Add new attribute type to manage attributes interface
     *
     * @param   \Magento\Framework\Event\Observer $observer
     * @return  $this
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        // adminhtml_product_attribute_types
        if ($this->config->isEnabled()) {
            $response = $observer->getEvent()->getResponse();
            $types = $response->getTypes();
            $types[] = [
                'value' => 'pagebuilder',
                'label' => __('Magento Page Builder')
            ];

            $response->setTypes($types);
        }

        return $this;
    }
}
