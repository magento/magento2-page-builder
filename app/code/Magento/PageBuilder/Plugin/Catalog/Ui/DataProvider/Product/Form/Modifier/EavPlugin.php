<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types = 1);

namespace Magento\PageBuilder\Plugin\Catalog\Ui\DataProvider\Product\Form\Modifier;

use Magento\Catalog\Api\Data\ProductAttributeInterface;
use Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\Eav as EavModifier;
use Magento\Framework\Stdlib\ArrayManager;
use Magento\PageBuilder\Model\Config;

/**
 * Data Provider for EAV Attributes on Product Page
 */
class EavPlugin
{
    public const META_ATTRIBUTE_CONFIG_PATH = 'arguments/data/config';

    /**
     * @var ArrayManager
     */
    private $arrayManager;

    /**
     * @var Config
     */
    private $config;

    /**
     * @param ArrayManager $arrayManager
     * @param Config $config
     */
    public function __construct(
        ArrayManager $arrayManager,
        Config $config
    ) {
        $this->arrayManager = $arrayManager;
        $this->config = $config;
    }

    /**
     * Setup Attribute Meta
     *
     * @param EavModifier $subject
     * @param array $result
     * @param ProductAttributeInterface $attribute
     * @param string $groupCode
     * @param int $sortOrder
     * @return array
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterSetupAttributeMeta(
        EavModifier $subject,
        $result,
        ProductAttributeInterface $attribute,
        $groupCode,
        $sortOrder
    ) {
        $meta = $result;

        if ($this->config->isContentPreviewEnabled() && $attribute->getData('is_pagebuilder_enabled')) {
            $meta = $this->arrayManager->merge(
                static::META_ATTRIBUTE_CONFIG_PATH,
                $result,
                [
                    'additionalClasses' => 'admin__field-wide admin__field-page-builder'
                ]
            );
        }

        return $meta;
    }

    /**
     * Setup Attribute Container Meta
     *
     * @param EavModifier $subject
     * @param array $result
     * @param ProductAttributeInterface $attribute
     * @return array
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterSetupAttributeContainerMeta(
        EavModifier $subject,
        $result,
        ProductAttributeInterface $attribute
    ) {
        $containerMeta = $result;

        if ($this->config->isContentPreviewEnabled() && $attribute->getData('is_pagebuilder_enabled')) {
            $containerMeta = $this->arrayManager->merge(
                static::META_ATTRIBUTE_CONFIG_PATH,
                $result,
                [
                    'additionalFieldsetClasses' => [
                        'admin__field-wide' => true,
                        'admin__fieldset-page-builder' => true
                    ],
                    'template' => 'Magento_PageBuilder/form/components/group/group'
                ]
            );
        }

        return $containerMeta;
    }
}
