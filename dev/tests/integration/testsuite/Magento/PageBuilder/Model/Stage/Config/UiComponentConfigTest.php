<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage\Config;

use Magento\TestFramework\Helper\Bootstrap;

class UiComponentConfigTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\Framework\ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var \Magento\Framework\Config\DataInterfaceFactory|\PHPUnit\Framework\MockObject\MockObject
     */
    private $dataInterfaceFactoryMock;

    /**
     * @var \Magento\PageBuilder\Model\Stage\Config\UiComponentConfig
     */
    private $model;

    protected function setUp(): void
    {
        $this->objectManager = Bootstrap::getObjectManager();

        $this->dataInterfaceFactoryMock = $this->getMockBuilder(\Magento\Framework\Config\DataInterfaceFactory::class)
            ->onlyMethods(['create'])
            ->disableOriginalConstructor()
            ->getMock();

        $this->model = $this->objectManager->create(
            \Magento\PageBuilder\Model\Stage\Config\UiComponentConfig::class,
            [
                'configFactory' => $this->dataInterfaceFactoryMock
            ]
        );
    }

    /**
     * Verify getFields will return the expected output given an example UI component configuration
     *
     * @param array $uiConfig
     * @param array $expectedFields
     * @dataProvider uiConfigDataProvider
     */
    public function testGetFields(array $uiConfig, array $expectedFields)
    {
        $uiConfigMock = $this->createMock(\Magento\Framework\Config\DataInterface::class);
        $this->dataInterfaceFactoryMock->expects($this->once())
            ->method('create')
            ->willReturn($uiConfigMock);
        $uiConfigMock->expects($this->once())
            ->method('get')
            ->willReturn($uiConfig);

        $this->assertEquals($this->model->getFields('test_form'), $expectedFields);
    }

    /**
     * Provide UI component config with expected output for 2 test cases, one with a normal field and another field
     * which sets a dataScope
     *
     * @return array
     */
    public static function uiConfigDataProvider() : array
    {
        return [
            [
                [
                    'children' => [
                        'test_field_name' => [
                            'arguments' => [
                                'data' => [
                                    'config' => [
                                        'formElement' => 'text',
                                        'componentType' => 'field',
                                        'default' => 'default_value',
                                        'visible' => 1,
                                        'required' => 1,
                                        'label' => __('Test Field Name')
                                    ]
                                ]
                            ]
                        ],
                    ]
                ],
                [
                    'test_field_name' => [
                        'default' => 'default_value'
                    ]
                ]
            ],
            [
                [
                    'children' => [
                        'test_datascope_name' => [
                            'arguments' => [
                                'data' => [
                                    'config' => [
                                        'dataScope' => 'namespace.test_datascope_name',
                                        'formElement' => 'text',
                                        'componentType' => 'field',
                                        'default' => 'default_value',
                                        'visible' => 1,
                                        'required' => 1,
                                        'label' => __('Test DataScope Name')
                                    ]
                                ]
                            ]
                        ]
                    ]
                ],
                [
                    'namespace' => [
                        'test_datascope_name' => [
                            'default' => 'default_value'
                        ]
                    ]
                ]
            ]
        ];
    }
}
