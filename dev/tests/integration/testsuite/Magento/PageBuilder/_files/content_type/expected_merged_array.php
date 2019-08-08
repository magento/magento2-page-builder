<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
return [
    'menu_sections' => [
        'menu_section1' => [
            'label' => 'Menu Section 1',
            'sortOrder' => '1',
            'name' => 'menu_section1',
            'translate' => 'label'
        ],
        'menu_section2' => [
            'label' => 'Menu Section 2 Label',
            'sortOrder' => '3',
            'name' => 'menu_section2',
            'translate' => 'label'
        ],
        'menu_section3' => [
            'label' => 'Menu Section 3 Label',
            'sortOrder' => '2',
            'name' => 'menu_section3',
            'translate' => 'label'
        ]
    ],
    'types' => [
        'type1' => [
            'sortOrder' => '1',
            'label' => 'Type 1 Label',
            'icon' => 'pagebuilder-type1-custom-icon',
            'form' => 'pagebuilder_type1_custom_form',
            'menu_section' => 'menu_section2',
            'component' => 'Path/to/component',
            'preview_component' => 'Path/to/preview/component',
            'master_component' => 'Path/to/master/component',
            'allowed_parents' => [
                0 => 'type3'
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'master_template' => 'Path/to/render/template',
                    'elements' => [
                        'main' => [
                            'style' => [
                                0 => [
                                    'var' => 'style_converter',
                                    'name' => 'converter',
                                    'converter' => 'Path/to/converter',
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Magento_PageBuilder/js/property/style-property-reader'
                                ],
                                1 => [
                                    'var' => 'style_no_converter',
                                    'name' => 'no_converter',
                                    'converter' => null,
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Magento_PageBuilder/js/property/style-property-reader'
                                ]
                            ],
                            'attributes' => [
                                0 => [
                                    'var' => 'name',
                                    'name' => 'data-content-type',
                                    'converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'preview_converter' => null,
                                    'reader' => 'Magento_PageBuilder/js/property/attribute-reader'
                                ]
                            ],
                            'tag' => [],
                            'html' => [],
                            'css' => [
                                'var' => 'css_classes',
                                'filter' => []
                            ]
                        ]
                    ],
                    'converters' => [],
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
                            'value' => 'Magento\\TestModulePageBuilderExtensionPoints\\Model\\Config\\'
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
                                    'value' => 'Magento\\TestModulePageBuilderExtensionPoints\\Model\\Config\\'
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
                    'value' => 'Magento\\TestModulePageBuilderExtensionPoints\\Model\\Config\\'
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
            'is_system' => 'false',
            'form' => 'pagebuilder_type2_custom_form',
            'menu_section' => 'menu_section2',
            'allowed_parents' => [
                0 => 'type1'
            ],
            'appearances' => [
                'default' => [
                    'data1' => 'custom_value',
                    'data2' => 'value2',
                    'data3' => 'value3',
                    'preview_template' => 'Path/to/preview/custom/template',
                    'master_template' => 'Path/to/render/custom/template',
                    'elements' => [
                        'first_element' => [
                            'style' => [
                                0 => [
                                    'var' => 'style_no_converter',
                                    'name' => 'no_converter',
                                    'converter' => null,
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Magento_PageBuilder/js/property/style-property-reader'
                                ],
                                1 => [
                                    'var' => 'style_attributes_change',
                                    'name' => 'custom_name',
                                    'converter' => 'Path/to/custom/converter',
                                    'preview_converter' => 'Path/to/preview/custom/converter',
                                    'persistence_mode' => 'write',
                                    'reader' => 'Magento_PageBuilder/js/property/style-property-reader'
                                ],
                                2 => [
                                    'var' => 'style_attributes_add',
                                    'name' => 'attributes_add',
                                    'converter' => 'Path/to/custom/converter',
                                    'preview_converter' => 'Path/to/preview/custom/converter',
                                    'persistence_mode' => 'write',
                                    'reader' => 'Magento_PageBuilder/js/property/style-property-reader'
                                ],
                                3 => [
                                    'var' => 'original_complex',
                                    'name' => null,
                                    'converter' => null,
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Path/to/reader'
                                ],
                                4 => [
                                    'var' => 'complex_style_attributes_change',
                                    'name' => null,
                                    'converter' => 'Path/to/custom/converter',
                                    'preview_converter' => 'Path/to/preview/custom/converter',
                                    'persistence_mode' => 'write',
                                    'reader' => 'Path/to/custom/reader'
                                ],
                                5 => [
                                    'var' => 'complex_style_attributes_add',
                                    'name' => null,
                                    'converter' => 'Path/to/custom/converter',
                                    'preview_converter' => 'Path/to/preview/custom/converter',
                                    'persistence_mode' => 'write',
                                    'reader' => 'Path/to/custom/reader'
                                ],
                                6 => [
                                    'var' => 'new_style',
                                    'name' => 'new-style',
                                    'converter' => null,
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Magento_PageBuilder/js/property/style-property-reader'
                                ],
                                7 => [
                                    'var' => 'new_complex',
                                    'name' => null,
                                    'converter' => null,
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Path/to/reader'
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
                                    'name' => 'data-content-type',
                                    'converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'preview_converter' => null,
                                    'reader' => 'Magento_PageBuilder/js/property/attribute-reader'
                                ],
                                1 => [
                                    'var' => 'attribute_change',
                                    'name' => 'data-custom',
                                    'converter' => 'Path/to/custom/converter',
                                    'persistence_mode' => 'write',
                                    'preview_converter' => 'Path/to/preview/custom/converter',
                                    'reader' => 'Magento_PageBuilder/js/property/attribute-reader'
                                ],
                                2 => [
                                    'var' => 'attribute_add',
                                    'name' => 'attribute_add',
                                    'converter' => 'Path/to/custom/converter',
                                    'persistence_mode' => 'write',
                                    'preview_converter' => 'Path/to/preview/custom/converter',
                                    'reader' => 'Magento_PageBuilder/js/property/attribute-reader'
                                ],
                                3 => [
                                    'var' => 'original_complex_attribute',
                                    'name' => null,
                                    'converter' => null,
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Path/to/reader'
                                ],
                                4 => [
                                    'var' => 'complex_attribute_change',
                                    'name' => null,
                                    'converter' => 'Path/to/custom/converter',
                                    'preview_converter' => 'Path/to/preview/custom/converter',
                                    'persistence_mode' => 'write',
                                    'reader' => 'Path/to/custom/reader'
                                ],
                                5 => [
                                    'var' => 'complex_attribute_add',
                                    'name' => null,
                                    'converter' => 'Path/to/custom/converter',
                                    'preview_converter' => 'Path/to/preview/custom/converter',
                                    'persistence_mode' => 'write',
                                    'reader' => 'Path/to/custom/reader'
                                ],
                                6 => [
                                    'var' => 'new_attribute',
                                    'name' => 'data-new',
                                    'converter' => 'Path/to/custom/converter',
                                    'persistence_mode' => 'write',
                                    'preview_converter' => 'Path/to/preview/custom/converter',
                                    'reader' => 'Magento_PageBuilder/js/property/attribute-reader'
                                ],
                                7 => [
                                    'var' => 'new_complex_attribute',
                                    'name' => null,
                                    'converter' => null,
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Path/to/reader'
                                ],
                                8 => [
                                    'name' => 'original_static',
                                    'value' => 'original_value',
                                    'static' => true
                                ],
                                9 => [
                                    'name' => 'static_attribute_change',
                                    'value' => 'custom_value',
                                    'static' => true
                                ],
                                10 => [
                                    'name' => 'new_static',
                                    'value' => 'new-value',
                                    'static' => true
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
                                'filter' => [
                                    0 => 'class-name',
                                    1 => 'new-class'
                                ]
                            ]
                        ],
                        'second_element' => [
                            'style' => [
                                0 => [
                                    'var' => 'style_no_converter',
                                    'name' => 'no_converter',
                                    'converter' => null,
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Magento_PageBuilder/js/property/style-property-reader'
                                ]
                            ],
                            'attributes' => [
                                0 => [
                                    'var' => 'name',
                                    'name' => 'data-content-type',
                                    'converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'preview_converter' => null,
                                    'reader' => 'Magento_PageBuilder/js/property/attribute-reader'
                                ]
                            ],
                            'tag' => [],
                            'html' => [],
                            'css' => [
                                'var' => 'css_classes',
                                'filter' => []
                            ]
                        ],
                        'third_element' => [
                            'style' => [
                                0 => [
                                    'var' => 'style_no_converter',
                                    'name' => 'no_converter',
                                    'converter' => null,
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Magento_PageBuilder/js/property/style-property-reader'
                                ]
                            ],
                            'attributes' => [
                                0 => [
                                    'var' => 'name',
                                    'name' => 'data-content-type',
                                    'converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'preview_converter' => null,
                                    'reader' => 'Magento_PageBuilder/js/property/attribute-reader'
                                ]
                            ],
                            'tag' => [],
                            'html' => [],
                            'css' => [
                                'var' => 'css_classes',
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
                    ],
                    'default' => 'true',
                    'form' => 'Path/to/custom/form',
                    'reader' => 'Path/to/custom/reader'
                ],
                'appearance1' => [
                    'preview_template' => 'Path/to/preview/template',
                    'master_template' => 'Path/to/render/template',
                    'elements' => [
                        'main' => [
                            'style' => [
                                0 =>[
                                    'var' => 'style_converter',
                                    'name' => 'converter',
                                    'converter' => 'Path/to/converter',
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Magento_PageBuilder/js/property/style-property-reader'
                                ],
                                1 => [
                                    'var' => 'style_no_converter',
                                    'name' => 'no_converter',
                                    'converter' => null,
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Magento_PageBuilder/js/property/style-property-reader'
                                ]
                            ],
                            'attributes' => [
                                0 => [
                                    'var' => 'name',
                                    'name' => 'data-content-type',
                                    'converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'preview_converter' => null,
                                    'reader' => 'Magento_PageBuilder/js/property/attribute-reader'
                                ]
                            ],
                            'tag' => [],
                            'html' => [],
                            'css' => [
                                'var' => 'css_classes',
                                'filter' => [],
                            ],
                        ],
                    ],
                    'converters' => [],
                    'default' => 'false',
                    'form' => 'Path/to/form',
                    'reader' => 'Path/to/reader'
                ],
                'appearance2' => [
                    'preview_template' => 'Path/to/preview/template',
                    'master_template' => 'Path/to/render/template',
                    'default' => 'false',
                    'converters' => [],
                    'reader' => 'Path/to/reader'
                ],
                'appearance3' => [
                    'preview_template' => 'Path/to/preview/template',
                    'master_template' => 'Path/to/render/template',
                    'converters' => [],
                    'default' => 'false',
                    'reader' => null
                ],
                'appearance4' => [
                    'preview_template' => 'Path/to/preview/template',
                    'master_template' => 'Path/to/render/template',
                    'elements' => [
                        'main' => [
                            'style' => [
                                0 =>[
                                    'var' => 'style_converter',
                                    'name' => 'converter',
                                    'converter' => 'Path/to/converter',
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Magento_PageBuilder/js/property/style-property-reader'
                                ],
                                1 => [
                                    'var' => 'style_no_converter',
                                    'name' => 'no_converter',
                                    'converter' => null,
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Magento_PageBuilder/js/property/style-property-reader'
                                ]
                            ],
                            'attributes' => [
                                0 => [
                                    'var' => 'name',
                                    'name' => 'data-content-type',
                                    'converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'preview_converter' => null,
                                    'reader' => 'Magento_PageBuilder/js/property/attribute-reader'
                                ]
                            ],
                            'tag' => [],
                            'html' => [],
                            'css' => [
                                'var' => 'css_classes',
                                'filter' => [],
                            ],
                        ],
                    ],
                    'converters' => [],
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
            'menu_section' => 'menu_section1',
            'allowed_parents' => [
                0 => 'stage'
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'master_template' => 'Path/to/render/template',
                    'elements' => [
                        'main' => [
                            'style' => [
                                0 =>[
                                    'var' => 'style_converter',
                                    'name' => 'converter',
                                    'converter' => 'Path/to/converter',
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Magento_PageBuilder/js/property/style-property-reader'
                                ],
                                1 => [
                                    'var' => 'style_no_converter',
                                    'name' => 'no_converter',
                                    'converter' => null,
                                    'preview_converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'reader' => 'Magento_PageBuilder/js/property/style-property-reader'
                                ]
                            ],
                            'attributes' => [
                                0 => [
                                    'var' => 'name',
                                    'name' => 'data-content-type',
                                    'converter' => null,
                                    'persistence_mode' => 'readwrite',
                                    'preview_converter' => null,
                                    'reader' => 'Magento_PageBuilder/js/property/attribute-reader'
                                ]
                            ],
                            'tag' => [],
                            'html' => [],
                            'css' => [
                                'var' => 'css_classes',
                                'filter' => [],
                            ],
                        ],
                    ],
                    'converters' => [],
                    'default' => 'true',
                    'reader' => 'Path/to/reader'
                ]
            ],
            'name' => 'type3',
            'translate' => 'label'
        ]
    ]
];
