<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
return [
    'groups' => [
        'group1' => [
            'label' => 'Group 1',
            'sortOrder' => '1',
            'name' => 'group1',
            'translate' => 'label'
        ],
        'group2' => [
            'label' => 'Group 2 Label',
            'sortOrder' => '3',
            'name' => 'group2',
            'translate' => 'label'
        ],
        'group3' => [
            'label' => 'Group 3 Label',
            'sortOrder' => '2',
            'name' => 'group3',
            'translate' => 'label'
        ]
    ],
    'types' => [
        'type1' => [
            'sortOrder' => '1',
            'label' => 'Type 1 Label',
            'icon' => 'pagebuilder-type1-custom-icon',
            'form' => 'pagebuilder_type1_custom_form',
            'group' => 'group2',
            'component' => 'Path/to/component',
            'preview_component' => 'Path/to/preview/component',
            'master_component' => 'Path/to/master/component',
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
                                        'preview_converter' => null
                                    ]
                                ],
                                'tag' => [],
                                'html' => [],
                                'css' => [
                                    'var' => 'css_classes',
                                    'converter' => null,
                                    'filter' => []
                                ]
                            ]
                        ],
                        'converters' => []
                    ],
                    'default' => 'true',
                    'reader' => 'Path/to/reader'
                ]
            ],
            'additional_data' => [
                'config1' => [
                    'name' => 'config1',
                    'xsi:type' => 'array',
                    'item' => [
                        'settingWithTypeString' => [
                            'name' => 'settingWithTypeString',
                            'xsi:type' => 'string',
                            'value' => 'string',
                        ],
                        'settingWithTypeBooleanTrue' => [
                            'name' => 'settingWithTypeBooleanTrue',
                            'xsi:type' => 'boolean',
                            'value' => 'true',
                        ],
                        'settingWithTypeBooleanFalse' => [
                            'name' => 'settingWithTypeBooleanFalse',
                            'xsi:type' => 'boolean',
                            'value' => 'false',
                        ],
                        'settingWithTypeInteger' => [
                            'name' => 'settingWithTypeInteger',
                            'xsi:type' => 'number',
                            'value' => '20',
                        ],
                        'settingWithTypeNull' => [
                            'name' => 'settingWithTypeNull',
                            'xsi:type' => 'null',
                        ],
                        'settingWithTypeNumber2' => [
                            'name' => 'settingWithTypeNumber2',
                            'xsi:type' => 'number',
                            'value' => '-90',
                        ],
                        'settingWithTypeObject' => [
                            'name' => 'settingWithTypeObject',
                            'xsi:type' => 'object',
                            'value' => 'Magento\\TestModulePageBuilderDataMigration\\Model\\Config\\'
                                . 'ContentType\\AdditionalData\\Provider\\TestData',
                        ],
                    ],
                ],
                'config2' => [
                    'name' => 'config2',
                    'xsi:type' => 'array',
                    'item' => [
                        'arrayConfig' => [
                            'name' => 'arrayConfig',
                            'xsi:type' => 'array',
                            'item' => [
                                'settingWithTypeString' => [
                                    'name' => 'settingWithTypeString',
                                    'xsi:type' => 'string',
                                    'value' => 'string',
                                ],
                                'settingWithTypeBooleanTrue' => [
                                    'name' => 'settingWithTypeBooleanTrue',
                                    'xsi:type' => 'boolean',
                                    'value' => 'true',
                                ],
                                'settingWithTypeBooleanFalse' => [
                                    'name' => 'settingWithTypeBooleanFalse',
                                    'xsi:type' => 'boolean',
                                    'value' => 'false',
                                ],
                                'settingWithTypeInteger' => [
                                    'name' => 'settingWithTypeInteger',
                                    'xsi:type' => 'number',
                                    'value' => '20',
                                ],
                                'settingWithTypeNull' => [
                                    'name' => 'settingWithTypeNull',
                                    'xsi:type' => 'null',
                                ],
                                'settingWithTypeNumber2' => [
                                    'name' => 'settingWithTypeNumber2',
                                    'xsi:type' => 'number',
                                    'value' => '-90',
                                ],
                                'settingWithTypeObject' => [
                                    'name' => 'settingWithTypeObject',
                                    'xsi:type' => 'object',
                                    'value' => 'Magento\\TestModulePageBuilderDataMigration\\Model\\Config\\'
                                        . 'ContentType\\AdditionalData\\Provider\\TestData',
                                ],
                            ],
                        ],
                    ],
                ],
                'settingWithTypeString' => [
                    'name' => 'settingWithTypeString',
                    'xsi:type' => 'string',
                    'value' => 'string',
                ],
                'settingWithTypeBooleanTrue' => [
                    'name' => 'settingWithTypeBooleanTrue',
                    'xsi:type' => 'boolean',
                    'value' => 'true',
                ],
                'settingWithTypeBooleanFalse' => [
                    'name' => 'settingWithTypeBooleanFalse',
                    'xsi:type' => 'boolean',
                    'value' => 'false',
                ],
                'settingWithTypeInteger' => [
                    'name' => 'settingWithTypeInteger',
                    'xsi:type' => 'number',
                    'value' => '20',
                ],
                'settingWithTypeNull' => [
                    'name' => 'settingWithTypeNull',
                    'xsi:type' => 'null',
                ],
                'settingWithTypeNumber2' => [
                    'name' => 'settingWithTypeNumber2',
                    'xsi:type' => 'number',
                    'value' => '-90',
                ],
                'settingWithTypeObject' => [
                    'name' => 'settingWithTypeObject',
                    'xsi:type' => 'object',
                    'value' => 'Magento\\TestModulePageBuilderDataMigration\\Model\\Config\\'
                        . 'ContentType\\AdditionalData\\Provider\\TestData',
                ],
            ],
            'name' => 'type1',
            'translate' => 'label'
        ],
        'type2' => [
            'sortOrder' => '2',
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
                    'readers' => [],
                    'data_mapping' => [
                        'elements' => [
                            'first_element' => [
                                'element' => 'first_element',
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
                                        'reader' => 'Path/to/reader',
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
                                        'reader' => 'Path/to/reader',
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
                                        'preview_converter' => null
                                    ],
                                    2 => [
                                        'var' => 'attribute_change',
                                        'name' => 'data-custom',
                                        'virtual' => 'false',
                                        'converter' => 'Path/to/custom/converter',
                                        'persist' => 'true',
                                        'preview_converter' => 'Path/to/preview/custom/converter'
                                    ],
                                    3 => [
                                        'var' => 'attribute_add',
                                        'name' => 'attribute_add',
                                        'virtual' => 'false',
                                        'converter' => 'Path/to/custom/converter',
                                        'persist' => 'true',
                                        'preview_converter' => 'Path/to/preview/custom/converter'
                                    ],
                                    4 => [
                                        'var' => 'new_attribute',
                                        'name' => 'data-new',
                                        'virtual' => 'true',
                                        'converter' => 'Path/to/custom/converter',
                                        'persist' => 'false',
                                        'preview_converter' => 'Path/to/preview/custom/converter'
                                    ],
                                    5 => [
                                        'name' => 'original_static',
                                        'value' => 'original_value',
                                        'static' => true
                                    ],
                                    6 => [
                                        'name' => 'static_attribute_change',
                                        'value' => 'custom_value',
                                        'static' => true
                                    ],
                                    7 => [
                                        'name' => 'new_static',
                                        'value' => 'new-value',
                                        'static' => true
                                    ],
                                    8 => [
                                        'var' => 'original_complex',
                                        'reader' => 'Path/to/reader',
                                        'converter' => null,
                                        'preview_converter' => null,
                                        'virtual' => null,
                                        'complex' => true,
                                        'persist' => null
                                    ],
                                    9 => [
                                        'var' => 'complex_style_attributes_change',
                                        'reader' => 'Path/to/custom/reader',
                                        'converter' => 'Path/to/custom/converter',
                                        'preview_converter' => 'Path/to/preview/custom/converter',
                                        'virtual' => 'false',
                                        'complex' => true,
                                        'persist' => null
                                    ],
                                    10 => [
                                        'var' => 'complex_style_attributes_add',
                                        'reader' => 'Path/to/custom/reader',
                                        'converter' => 'Path/to/custom/converter',
                                        'preview_converter' => 'Path/to/preview/custom/converter',
                                        'virtual' => 'true',
                                        'complex' => true,
                                        'persist' => null
                                    ],
                                    11 => [
                                        'var' => 'new_complex',
                                        'reader' => 'Path/to/reader',
                                        'converter' => null,
                                        'preview_converter' => null,
                                        'virtual' => null,
                                        'complex' => true,
                                        'persist' => null
                                    ]
                                ],
                                'tag' => [
                                    'var' => 'tag',
                                    'converter' => 'Path/to/custom/converter'
                                ],
                                'html' => [
                                    'var' => 'html',
                                    'converter' => null,
                                    'preview_converter' => null
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
                                'element' => 'second_element',
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
                                        'preview_converter' => null
                                    ]
                                ],
                                'tag' => [],
                                'html' => [],
                                'css' => [
                                    'var' => 'css_classes',
                                    'converter' => null,
                                    'filter' => []
                                ]
                            ],
                            'third_element' => [
                                'element' => 'third_element',
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
                                        'preview_converter' => null
                                    ]
                                ],
                                'tag' => [],
                                'html' => [],
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
                    'default' => 'true',
                    'form' => 'Path/to/custom/form',
                    'reader' => 'Path/to/custom/reader'
                ],
                'appearance1' => [
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
                    'default' => 'false',
                    'form' => 'Path/to/form',
                    'reader' => 'Path/to/reader'
                ],
                'appearance2' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
                    'default' => 'false',
                    'reader' => 'Path/to/reader'
                ],
                'appearance3' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
                    'default' => 'false',
                    'reader' => null
                ],
                'appearance4' => [
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
                    'default' => null,
                    'form' => 'Path/to/custom/form',
                    'reader' => 'Path/to/reader'
                ]
            ],
            'name' => 'type2',
            'translate' => 'label'
        ],
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
