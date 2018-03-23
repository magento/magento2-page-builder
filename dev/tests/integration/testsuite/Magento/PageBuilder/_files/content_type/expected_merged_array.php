<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
return [
    'groups' => [
        'group1' => [
            'label' => 'Group 1',
            'sortOrder' => '1'
        ],
        'group2' => [
            'label' => 'Group 2 Label',
            'sortOrder' => '3'
        ],
        'group3' => [
            'label' => 'Group 3',
            'sortOrder' => '2'
        ],
    ],
    'types' => [
        'type1' => [
            'label' => 'Type 1 Label',
            'icon' => 'pagebuilder-type1-custom-icon',
            'form' => 'pagebuilder_type1_custom_form',
            'group' => 'group2',
            'component' => 'Path/to/component',
            'preview_component' => 'Path/to/preview/component',
            'allowed_parents' => [
                0 => 'stage'
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [
                            0 => 'Path/to/reader'
                    ],
                    'data_mapping' => [
                        'elements' => [
                            'main' => [
                                'path' => '.',
                                'style' => [
                                    0 => [
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
                                        'var' => 'name',
                                        'name' => 'data-role',
                                        'virtual' => null,
                                        'converter' => null,
                                        'persist' => null,
                                        'preview_converter' => null
                                    ]
                                ],
                                'css' => [
                                    'var' => 'css_classes',
                                    'converter' => null,
                                    'filter' => []
                                ]
                            ]
                        ],
                        'converters' => []
                    ],
                    'default' => 'true'
                ]
            ]
        ],
        'type2' => [
            'label' => 'Type 2 Label',
            'icon' => 'pagebuilder-type2-custom-icon',
            'component' => 'Path/to/custom/component',
            'preview_component' => 'Path/to/preview/custom/component',
            'backend_block' => 'Path/to/custom/backend/block',
            'backend_template' => 'Path/to/custom/backend/template',
            'is_visible' => 'false',
            'form' => 'pagebuilder_type2_custom_form',
            'group' => 'group2',
            'allowed_parents' => [
                0 => 'stage',
                1 => 'type1'
            ],
            'appearances' => [
                'default' => [
                    'data1' => 'custom_value',
                    'data2' => 'value2',
                    'data3' => 'value3',
                    'preview_template' => 'Path/to/preview/custom/template',
                    'render_template' => 'Path/to/render/custom/template',
                    'readers' => [
                        0 => 'Path/to/custom/reader1',
                        1 => 'Path/to/reader2',
                        2 => 'Path/to/custom/reader3',
                    ],
                    'data_mapping' => [
                        'elements' => [
                            'first_element' => [
                                'path' => '.',
                                'style' => [
                                    0 => [
                                        'var' => 'style_no_converter',
                                        'name' => 'no_converter',
                                        'converter' => null,
                                        'preview_converter' => null,
                                        'persist' => null,
                                        'virtual' => null
                                    ],
                                    1 => [
                                        'var' => 'style_attributes_change',
                                        'name' => 'custom_name',
                                        'converter' => 'Path/to/custom/converter',
                                        'preview_converter' => 'Path/to/preview/custom/converter',
                                        'persist' => 'true',
                                        'virtual' => 'false'
                                    ],
                                    2 => [
                                        'var' => 'style_attributes_add',
                                        'name' => 'attributes_add',
                                        'converter' => 'Path/to/custom/converter',
                                        'preview_converter' => 'Path/to/preview/custom/converter',
                                        'persist' => 'false',
                                        'virtual' => 'true'
                                    ],
                                    3 => [
                                        'var' => 'new_style',
                                        'name' => 'new-style',
                                        'converter' => null,
                                        'preview_converter' => null,
                                        'persist' => null,
                                        'virtual' => null
                                    ],
                                    4 => [
                                        'var' => 'original_complex',
                                        'reader' => null,
                                        'converter' => null,
                                        'preview_converter' => null,
                                        'virtual' => null,
                                        'complex' => true
                                    ],
                                    5 => [
                                        'var' => 'complex_style_attributes_change',
                                        'reader' => 'Path/to/custom/reader',
                                        'converter' => 'Path/to/custom/converter',
                                        'preview_converter' => 'Path/to/preview/custom/converter',
                                        'virtual' => 'false',
                                        'complex' => true
                                    ],
                                    6 => [
                                        'var' => 'complex_style_attributes_add',
                                        'reader' => 'Path/to/custom/reader',
                                        'converter' => 'Path/to/custom/converter',
                                        'preview_converter' => 'Path/to/preview/custom/converter',
                                        'virtual' => 'true',
                                        'complex' => true
                                    ],
                                    7 => [
                                        'var' => 'new_complex',
                                        'reader' => null,
                                        'converter' => null,
                                        'preview_converter' => null,
                                        'virtual' => null,
                                        'complex' => true
                                    ],
                                    8 => [
                                        'name' => 'original_static',
                                        'value' => 'original_value',
                                        'static' => true
                                    ],
                                    9 => [
                                        'name' => 'static_style_attributes_change',
                                        'value' => 'custom_value',
                                        'static' => true
                                    ],
                                    10 => [
                                        'name' => 'new_static',
                                        'value' => 'new-value',
                                        'static' => true
                                    ]
                                ],
                                'attributes' => [
                                    0 => [
                                        'var' => 'name',
                                        'name' => 'data-role',
                                        'virtual' => null,
                                        'converter' => null,
                                        'persist' => null,
                                        'preview_converter' => null
                                    ],
                                    1 => [
                                        'var' => 'attribute_change',
                                        'name' => 'data-custom',
                                        'virtual' => 'false',
                                        'converter' => 'Path/to/custom/converter',
                                        'persist' => 'true',
                                        'preview_converter' => 'Path/to/preview/custom/converter'
                                    ],
                                    2 => [
                                        'var' => 'attribute_add',
                                        'name' => 'attribute_add',
                                        'virtual' => 'false',
                                        'converter' => 'Path/to/custom/converter',
                                        'persist' => 'true',
                                        'preview_converter' => 'Path/to/preview/custom/converter'
                                    ],
                                    3 => [
                                        'var' => 'new_attribute',
                                        'name' => 'data-new',
                                        'virtual' => 'true',
                                        'converter' => 'Path/to/custom/converter',
                                        'persist' => 'false',
                                        'preview_converter' => 'Path/to/preview/custom/converter'
                                    ],
                                    4 => [
                                        'name' => 'original_static',
                                        'value' => 'original_value',
                                        'static' => true
                                    ],
                                    5 => [
                                        'name' => 'static_attribute_change',
                                        'value' => 'custom_value',
                                        'static' => true
                                    ],
                                    6 => [
                                        'name' => 'new_static',
                                        'value' => 'new-value',
                                        'static' => true
                                    ],
                                    7 => [
                                        'var' => 'original_complex',
                                        'reader' => null,
                                        'converter' => null,
                                        'preview_converter' => null,
                                        'virtual' => null,
                                        'complex' => true
                                    ],
                                    8 => [
                                        'var' => 'complex_style_attributes_change',
                                        'reader' => 'Path/to/custom/reader',
                                        'converter' => 'Path/to/custom/converter',
                                        'preview_converter' => 'Path/to/preview/custom/converter',
                                        'virtual' => 'false',
                                        'complex' => true
                                    ],
                                    9 => [
                                        'var' => 'complex_style_attributes_add',
                                        'reader' => 'Path/to/custom/reader',
                                        'converter' => 'Path/to/custom/converter',
                                        'preview_converter' => 'Path/to/preview/custom/converter',
                                        'virtual' => 'true',
                                        'complex' => true
                                    ],
                                    10 => [
                                        'var' => 'new_complex',
                                        'reader' => null,
                                        'converter' => null,
                                        'preview_converter' => null,
                                        'virtual' => null,
                                        'complex' => true
                                    ]
                                ],
                                'tag' => [
                                    'var' => 'tag',
                                    'converter' => 'Path/to/custom/converter'
                                ],
                                'html' => [
                                    'var' => 'html',
                                    'placeholder' => 'custom-text'
                                ],
                                'css' => [
                                    'var' => 'css_classes',
                                    'converter' => 'Path/to/custom/converter',
                                    'filter' => [
                                        0 => 'class-name',
                                        1 => 'new-class'
                                    ]
                                ]
                            ],
                            'second_element' => [
                                'path' => '//a',
                                'style' => [
                                    0 => [
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
                                        'var' => 'name',
                                        'name' => 'data-role',
                                        'virtual' => null,
                                        'converter' => null,
                                        'persist' => null,
                                        'preview_converter' => null
                                    ]
                                ],
                                'css' => [
                                    'var' => 'css_classes',
                                    'converter' => null,
                                    'filter' => []
                                ]
                            ],
                            'third_element' => [
                                'path' => '//div',
                                'style' => [
                                    0 => [
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
                                        'var' => 'name',
                                        'name' => 'data-role',
                                        'virtual' => null,
                                        'converter' => null,
                                        'persist' => null,
                                        'preview_converter' => null
                                    ]
                                ],
                                'css' => [
                                    'var' => 'css_classes',
                                    'converter' => null,
                                    'filter' => []
                                ]
                            ]
                        ],
                        'converters' => [
                            0 => [
                                'name' => 'converter1',
                                'component' => 'Path/to/custom/converter',
                                'config' => [
                                    'item1' => 'value1',
                                    'change_value' => 'custom_value',
                                    'new_value' => 'value3'
                                ]
                            ],
                            1 => [
                                'name' => 'converter2',
                                'component' => 'Path/to/converter',
                                'config' => [
                                    'item1' => 'value1'
                                ]
                            ],
                            2 => [
                                'name' => 'converter3',
                                'component' => 'Path/to/custom/converter',
                                'config' => [
                                    'item1' => 'value1'
                                ]
                            ]
                        ]
                    ],
                    'default' => 'true'
                ],
                'appearance1' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [
                        0 => 'Path/to/reader'
                    ],
                    'data_mapping' => [
                        'elements' => [
                            'main' => [
                                'path' => '.',
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
                                        'var' => 'name',
                                        'name' => 'data-role',
                                        'virtual' => null,
                                        'converter' => null,
                                        'persist' => null,
                                        'preview_converter' => null,
                                    ]
                                ],
                                'css' => [
                                    'var' => 'css_classes',
                                    'converter' => null,
                                    'filter' => [],
                                ],
                            ],
                        ],
                        'converters' => []
                    ],
                    'default' => 'false'
                ],
                'appearance2' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [
                        0 => 'Path/to/reader'
                    ],
                    'default' => 'false'
                ],
                'appearance3' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
                    'default' => 'false'
                ],
                'appearance4' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [
                        0 => 'Path/to/reader'
                    ],
                    'data_mapping' => [
                        'elements' => [
                            'main' => [
                                'path' => '.',
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
                                        'var' => 'name',
                                        'name' => 'data-role',
                                        'virtual' => null,
                                        'converter' => null,
                                        'persist' => null,
                                        'preview_converter' => null,
                                    ]
                                ],
                                'css' => [
                                    'var' => 'css_classes',
                                    'converter' => null,
                                    'filter' => [],
                                ],
                            ],
                        ],
                        'converters' => []
                    ],
                    'default' => 'false'
                ]
            ]
        ],
        'type3' => [
            'label' => 'Type 3',
            'icon' => 'pagebuilder-type3-icon',
            'form' => 'pagebuilder_type3_form',
            'group' => 'group1'
        ],
        'type4' => [
            'label' => 'Type 4',
            'icon' => 'pagebuilder-type4-icon',
            'component' => 'Path/to/component',
            'preview_component' => 'Path/to/preview/component',
            'form' => 'pagebuilder_type4_form',
            'group' => 'group1',
            'allowed_parents' => [
                0 => 'stage'
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [
                        0 => 'Path/to/reader'
                    ],
                    'data_mapping' => [
                        'elements' => [
                            'main' => [
                                'path' => '.',
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
                                        'var' => 'name',
                                        'name' => 'data-role',
                                        'virtual' => null,
                                        'converter' => null,
                                        'persist' => null,
                                        'preview_converter' => null,
                                    ]
                                ],
                                'css' => [
                                    'var' => 'css_classes',
                                    'converter' => null,
                                    'filter' => [],
                                ],
                            ],
                        ],
                        'converters' => []
                    ],
                    'default' => 'true'
                ]
            ]
        ]
    ]
];
