<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Ui\Component\Listing\Column\Attribute\Scope;

use Magento\Framework\Data\OptionSourceInterface;

/**
 * Class Options
 */
class Options implements OptionSourceInterface
{
    /**
     * Get options
     * @return array
     */
    public function toOptionArray()
    {
        return [
            \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE => [
                'label' => __('Store View'),
                'value' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE
            ],
            \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_WEBSITE => [
                'label' => __('Web Site'),
                'value' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_WEBSITE
            ],
            \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_GLOBAL => [
                'label' => __('Global'),
                'value' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_GLOBAL
            ]
        ];
    }
}
