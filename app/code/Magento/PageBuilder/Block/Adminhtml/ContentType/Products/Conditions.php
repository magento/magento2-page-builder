<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block\Adminhtml\ContentType\Products;

use Magento\Backend\Block\Template;

/**
 * The block used to render the conditions rule tree form within the PageBuilder interface.
 */
class Conditions extends Template
{
    /**
     *
     * @var string
     */
    protected $_template = 'Magento_PageBuilder::content_type/products/conditions.phtml';

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
     * Returns the form namespace to be used with the JS config
     *
     * @return string
     */
    public function getFormNamespace(): string
    {
        return 'pagebuilder_products_form';
    }

    /**
     * Returns an array of arguments to pass to the condition tree UIComponent
     *
     * @return array
     */
    private function getConfig(): array
    {
        return [
            'formNamespace' => $this->getFormNamespace(),
            'componentUrl' => $this->getUrl(
                'pagebuilder/contenttype/products_conditions',
                ['form_namespace' => $this->getFormNamespace()]
            ),
            'jsObjectName' => $this->getFormNamespace(),
            'childComponentUrl' => $this->getUrl(
                'pagebuilder/contenttype/products_conditions_child',
                ['form_namespace' => $this->getFormNamespace()]
            ),
        ];
    }

    public function getConfigJson(): string
    {
        return $this->serializer->serialize([
            '[data-role=pagebuilder-product-conditions-form-placeholder]' => [
                'Magento_PageBuilder/js/content-type/products/conditions-loader' => $this->getConfig(),
            ]
        ]);
    }
}
