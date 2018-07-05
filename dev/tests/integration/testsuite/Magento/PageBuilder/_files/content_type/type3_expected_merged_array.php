<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

return [
    'types' => [
        'type3' => [
            'sortOrder' => '3',
            'label' => 'Custom Type 3',
            'icon' => 'pagebuilder-type3-icon',
            'component' => 'Path/to/custom/component',
            'form' => 'pagebuilder_type3_form',
            'group' => 'group1',
            'allowed_parents' => [
                0 => 'stage'
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
                    'data_mapping' => [
                        'elements' => [
                            'main' => [
                                'element' => 'main',
                                'style' => [
                                    0 =>[
                                        'var' => 'style_converter',
                                        'name' => 'converter',
                                        'converter' => 'Path/to/converter',
                                        'preview_converter' => null,
                                        'persist' => null,
                                        'virtual' => null
                                    ],
                                    1 => [
                                        'var' => 'style_no_converter',
                                        'name' => 'no_converter',
                                        'converter' => null,
                                        'preview_converter' => null,
                                        'persist' => null,
                                        'virtual' => null
                                    ]
                                ],
                                'attributes' => [
                                    0 => [
                                        'var' => 'element',
                                        'name' => 'data-element',
                                        'virtual' => null,
                                        'converter' => null,
                                        'persist' => null,
                                        'preview_converter' => null
                                    ],
                                    1 => [
                                        'var' => 'name',
                                        'name' => 'data-role',
                                        'virtual' => null,
                                        'converter' => null,
                                        'persist' => null,
                                        'preview_converter' => null,
                                    ]
                                ],
                                'tag' => [],
                                'html' => [],
                                'css' => [
                                    'var' => 'css_classes',
                                    'converter' => null,
                                    'filter' => [],
                                ],
                            ],
                        ],
                        'converters' => []
                    ],
                    'default' => 'true',
                    'reader' => 'Path/to/reader'
                ]
            ],
            'name' => 'type3',
            'translate' => 'label'
        ]
    ]
];
