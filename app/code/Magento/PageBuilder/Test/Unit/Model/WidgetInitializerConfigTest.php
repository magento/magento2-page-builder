<?php
/**
 * Copyright 2024 Adobe
 * All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Model;

use Magento\PageBuilder\Model\WidgetInitializerConfig;
use PHPUnit\Framework\TestCase;

/**
 * Test for WidgetInitializerConfig
 */
class WidgetInitializerConfigTest extends TestCase
{
    /**
     * Test different config variation.
     *
     * @dataProvider configProvider
     * @param array $config
     * @param array $expectedConfig
     */
    public function testGetConfig(array $config, array $expectedConfig): void
    {
        $model = new WidgetInitializerConfig(
            $config
        );

        $actualConfig = $model->getConfig();
        $this->assertEquals($expectedConfig, $actualConfig);
    }

    /**
     * @return array
     */
    public static function configProvider(): array
    {
        return [
            [
                [
                    'products' => [
                        'default' => [
                            'component' => 'test',
                            'appearance' => 'default',
                            'config' => [
                                'a' => true
                            ]
                        ]
                    ]
                ],
                [
                    '[data-content-type="products"][data-appearance="default"]' => [
                        'test' => [
                            'a' => true
                        ]
                    ]
                ]
            ],
            [
                [
                    'products' => [
                        'default' => [
                            'component' => 'test-component',
                            'appearance' => 'default',
                            'config' => [
                                'a' => true
                            ]
                        ],
                        'another' => [
                            'component' => 'another-test-component',
                            'appearance' => 'not_default',
                            'config' => [
                                'b' => false
                            ]
                        ]
                    ]
                ],
                [
                    '[data-content-type="products"][data-appearance="default"]' => [
                        'test-component' => [
                            'a' => true
                        ]
                    ],
                    '[data-content-type="products"][data-appearance="not_default"]' => [
                        'another-test-component' => [
                            'b' => false
                        ]
                    ]
                ]
            ]
        ];
    }
}
