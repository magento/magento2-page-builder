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
     * @param \Magento\Eav\Model\Entity\Attribute\AbstractAttribute $attribute
     * @param array $excludeAttr
     * @return bool
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    protected function shouldDisplay(
        \Magento\Eav\Model\Entity\Attribute\AbstractAttribute $attribute,
        array $excludeAttr
    ) {
        return parent::shouldDisplay($attribute, $excludeAttr)
            && (($this->getExcludePagebuilder() && !$attribute->getIsPagebuilderEnabled())
            || ($this->getPagebuilderOnly() && $attribute->getIsPagebuilderEnabled()));
    }
}
