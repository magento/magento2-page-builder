<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types = 1);

namespace Magento\PageBuilder\Plugin\Catalog\Ui\DataProvider\Product\Form\Modifier;

use Magento\Catalog\Api\Data\ProductAttributeInterface;
use Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\Eav as EavModifier;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Exception\NotFoundException;
use Magento\Framework\Stdlib\ArrayManager;

class EavPlugin
{
    /**
     * @var ArrayManager
     */
    private $arrayManager;

    /**
     * @param ArrayManager $arrayManager
     */
    public function __construct(ArrayManager $arrayManager)
    {
        $this->arrayManager = $arrayManager;
    }

    /**
     * @param EavModifier $subject
     * @param array $result
     * @param ProductAttributeInterface $attribute
     * @param string $groupCode
     * @param int $sortOrder
     * @return array
     */
    public function afterSetupAttributeMeta(
        EavModifier $subject,
        $result,
        ProductAttributeInterface $attribute,
        $groupCode,
        $sortOrder
    )
    {
        $attributeCode = $attribute->getAttributeCode();
        $meta = $result;

        if ($attributeCode === 'description') {
            $meta = $this->arrayManager->merge(
                'arguments/data/config',
                $result,
                [
                    'additionalClasses' => 'admin__field-wide admin__field-page-builder'
                ]
            );
        }

        return $meta;
    }
}
