<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block\Adminhtml\Form\Element;

use Magento\Backend\Block\Template;

/**
 * The block used to render the conditions rule tree form within the PageBuilder interface.
 *
 * @api
 */
class ProductConditions extends Template
{
    /**
     *
     * @var string
     */
    protected $_template = 'Magento_PageBuilder::form/element/conditions.phtml';

    /**
     * @var \Magento\Framework\Serialize\Serializer\Json
     */
    private $serializer;

    /**
     * Conditions constructor.
     * @param Template\Context $context
     * @param \Magento\Framework\Serialize\Serializer\Json $serializer
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Serialize\Serializer\Json $serializer,
        array $data = []
    ) {
        $this->serializer = $serializer;
        parent::__construct($context, $data);
    }

    /**
     * Returns an array of arguments to pass to the condition tree UIComponent
     *
     * @return array
     */
    private function getConfig(): array
    {
        $formNamespace = $this->getData('formNamespace');
        $attribute = $this->getData('attribute');
        $jsObjectName = $formNamespace . '_' . $attribute;

        return [
            'formNamespace' => $formNamespace,
            'componentUrl' => $this->getUrl(
                'pagebuilder/form/element_productconditions',
                [
                    'form_namespace' => $formNamespace,
                    'prefix' => $attribute,
                    'js_object_name' => $jsObjectName,
                ]
            ),
            'jsObjectName' => $jsObjectName,
            'childComponentUrl' => $this->getUrl(
                'pagebuilder/form/element_productconditions_child',
                [
                    'form_namespace' => $formNamespace,
                    'prefix' => $attribute,
                    'js_object_name' => $jsObjectName,
                ]
            ),
            'attribute' => $attribute,
        ];
    }

    /**
     * Creates a JSON string containing the configuration for the needed JS components in the mage-init format
     *
     * @return string
     */
    public function getConfigJson(): string
    {
        return $this->serializer->serialize([
            '[data-role=pagebuilder-conditions-form-placeholder-' . $this->getData('attribute') . ']' => [
                'Magento_PageBuilder/js/form/element/conditions-loader' => $this->getConfig(),
            ]
        ]);
    }
}
