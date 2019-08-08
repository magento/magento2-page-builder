<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Block\Catalog\Block\Product\View;

use Magento\Framework\DataObject;

/**
 * Create a new instance of attributes which excludes Page Builder attributes
 */
class Attributes extends \Magento\Catalog\Block\Product\View\Attributes
{
    const DISPLAY_ATTRIBUTES_NON_PAGEBUILDER = 'non_pagebuilder';

    const DISPLAY_ATTRIBUTES_PAGEBUILDER_ONLY = 'pagebuilder_only';

    /**
     * @inheritdoc
     */
    public function getProduct()
    {
        $product = parent::getProduct();

        if (!$product) {
            $product = new DataObject();
            $product->setAttributes([]);
        }

        return $product;
    }

    /**
     * Determine if we should display the attribute on the front-end, add support for exclude page builder & page
     * builder only options on class. display_attributes can be set to determine whether to include just Page Builder
     * attributes or to exclude them.
     *
     * @param \Magento\Eav\Model\Entity\Attribute\AbstractAttribute $attribute
     * @param array $excludeAttr
     * @return bool
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    protected function isVisibleOnFrontend(
        \Magento\Eav\Model\Entity\Attribute\AbstractAttribute $attribute,
        array $excludeAttr
    ) : bool {
        return parent::isVisibleOnFrontend($attribute, $excludeAttr)
            && (($this->getDisplayAttributes() == self::DISPLAY_ATTRIBUTES_NON_PAGEBUILDER
                    && !$attribute->getIsPagebuilderEnabled())
            || ($this->getDisplayAttributes() == self::DISPLAY_ATTRIBUTES_PAGEBUILDER_ONLY
                    && $attribute->getIsPagebuilderEnabled()));
    }
}
