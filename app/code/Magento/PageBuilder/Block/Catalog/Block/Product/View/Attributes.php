<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Block\Catalog\Block\Product\View;

class Attributes extends \Magento\Catalog\Block\Product\View\Attributes
{
    /**
     * Determine if we should display the attribute on the front-end, add support for exclude page builder & page
     * builder only options on class.
     *
     * pagebuilder_attributes can be set to determine whether to include just Page Builder attributes or to exclude
     * them.
     *
     * @param \Magento\Eav\Model\Entity\Attribute\AbstractAttribute $attribute
     * @param array $excludeAttr
     * @return bool
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    protected function isVisibleOnFrontend(
        \Magento\Eav\Model\Entity\Attribute\AbstractAttribute $attribute,
        array $excludeAttr
    ) {
        return parent::isVisibleOnFrontend($attribute, $excludeAttr)
            && (($this->getPagebuilderAttributes() && $attribute->getIsPagebuilderEnabled())
            || (!$this->getPagebuilderAttributes() && !$attribute->getIsPagebuilderEnabled()));
    }
}
