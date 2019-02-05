<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Api;

class ProductAttributeRepositoryTest extends \Magento\TestFramework\TestCase\WebapiAbstract
{
    const SERVICE_NAME = 'catalogProductAttributeRepositoryV1';
    const SERVICE_VERSION = 'V1';
    const RESOURCE_PATH = '/V1/products/attributes';

    public function testCreatePageBuilderAttribute()
    {
        $attributeCode = uniqid('label_attr_code');
        $attribute = $this->createPageBuilderAttribute($attributeCode);

        $this->assertEquals('front_lbl', $attribute['default_frontend_label']);
        $this->assertNotEmpty($attribute['extension_attributes']);
        $this->assertTrue($attribute['extension_attributes']['is_pagebuilder_enabled']);
    }

    /**
     * @param $attributeCode
     * @return array
     */
    private function createPageBuilderAttribute($attributeCode)
    {
        $attributeData = [
            'attribute' => [
                'attribute_code' => $attributeCode,
                'entity_type_id' => '4',
                'frontend_labels' => [
                    [
                        'store_id' => 0,
                        'label' => 'front_lbl'
                    ],
                ],
                'is_required' => true,
                "default_value" => "",
                "frontend_input" => "textarea",
                "is_wysiwyg_enabled" => 1,
                "is_system_on_front" => true,
                "is_searchable" => true,
                "is_system_in_advanced_search" => true,
                "is_filterable" => true,
                "is_filterable_in_search" => true,
                \Magento\Framework\Api\ExtensibleDataInterface::EXTENSION_ATTRIBUTES_KEY => [
                    'is_pagebuilder_enabled' => 1
                ]
            ],
        ];

        $serviceInfo = [
            'rest' => [
                'resourcePath' => self::RESOURCE_PATH . '/',
                'httpMethod' => \Magento\Framework\Webapi\Rest\Request::HTTP_METHOD_POST,
            ],
            'soap' => [
                'service' => self::SERVICE_NAME,
                'serviceVersion' => self::SERVICE_VERSION,
                'operation' => self::SERVICE_NAME . 'Save',
            ],
        ];
        $attribute = $this->_webApiCall($serviceInfo, $attributeData);
        return $attribute;
    }
}
