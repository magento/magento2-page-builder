<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Ui\DataProvider\Product\Form\Modifier\Eav;

class WysiwygConfigDataProcessor implements
    \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\Eav\WysiwygConfigDataProcessorInterface
{
    /**
     * {@inheritdoc}
     */
    public function process(\Magento\Catalog\Api\Data\ProductAttributeInterface $attribute)
    {
        $wysiwygConfigData = [];
        if ($attribute->getData('is_pagebuilder_enabled')) {
            $wysiwygConfigData['is_pagebuilder_enabled'] = true;
            $wysiwygConfigData['pagebuilder_button'] = true;
        } else {
            $wysiwygConfigData['is_pagebuilder_enabled'] = false;
        }
        return $wysiwygConfigData;
    }
}
