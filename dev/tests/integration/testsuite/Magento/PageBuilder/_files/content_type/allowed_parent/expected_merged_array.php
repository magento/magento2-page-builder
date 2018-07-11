<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

return [
    'types' => [
        'parents_and_children_allow' => [
            'name' => 'parents_and_children_allow',
            'label' => 'Type 1',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'group' => 'group',
            'sortOrder' => '1',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'parents_and_children_allow',
                1 => 'parents_and_children_deny',
                2 => 'parents_allow',
                3 => 'parents_deny',
                4 => 'children_allow',
                5 => 'children_deny',
                6 => 'no_parents_and_children',
                7 => 'parents_allow_with_parent',
                8 => 'parents_deny_with_parent',
                9 => 'children_allow_with_child',
                10 => 'children_deny_with_child'
            ],
            'parents' => [
                'defaultPolicy' => 'allow',
                'types' => []
            ],
            'children' => [
                'defaultPolicy' => 'allow',
                'types' => []
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
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
            ]
        ],
        'parents_and_children_deny' => [
            'name' => 'parents_and_children_deny',
            'label' => 'Type 2',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'group' => 'group',
            'sortOrder' => '2',
            'translate' => 'label',
            'allowed_parents' => [],
            'parents' => [
                'defaultPolicy' => 'deny',
                'types' => []
            ],
            'children' => [
                'defaultPolicy' => 'deny',
                'types' => []
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
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
            ]
        ],
        'parents_allow' => [
            'name' => 'parents_allow',
            'label' => 'Type 3',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'group' => 'group',
            'sortOrder' => '3',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'parents_and_children_allow',
                1 => 'parents_and_children_deny',
                2 => 'parents_allow',
                3 => 'parents_deny',
                4 => 'children_allow',
                5 => 'children_deny',
                6 => 'no_parents_and_children',
                7 => 'parents_allow_with_parent',
                8 => 'parents_deny_with_parent',
                9 => 'children_allow_with_child',
                10 => 'children_deny_with_child'
            ],
            'parents' => [
                'defaultPolicy' => 'allow',
                'types' => []
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
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
            ]
        ],
        'parents_deny' => [
            'name' => 'parents_deny',
            'label' => 'Type 4',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'group' => 'group',
            'sortOrder' => '4',
            'translate' => 'label',
            'allowed_parents' => [],
            'parents' => [
                'defaultPolicy' => 'deny',
                'types' => []
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
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
            ]
        ],
        'children_allow' => [
            'name' => 'children_allow',
            'label' => 'Type 5',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'group' => 'group',
            'sortOrder' => '5',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'parents_and_children_allow',
                1 => 'children_allow',
                2 => 'children_allow_with_child'
            ],
            'children' => [
                'defaultPolicy' => 'allow',
                'types' => []
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
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
            ]
        ],
        'children_deny' => [
            'name' => 'children_deny',
            'label' => 'Type 6',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'group' => 'group',
            'sortOrder' => '6',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'parents_and_children_allow',
                1 => 'children_allow',
                2 => 'children_allow_with_child'
            ],
            'children' => [
                'defaultPolicy' => 'deny',
                'types' => []
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
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
            ]
        ],
        'no_parents_and_children' => [
            'name' => 'no_parents_and_children',
            'label' => 'Type 7',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'group' => 'group',
            'sortOrder' => '7',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'parents_and_children_allow',
                1 => 'children_allow',
                2 => 'children_deny_with_child'
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
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
            ]
        ],
        'parents_allow_with_parent' => [
            'name' => 'parents_allow_with_parent',
            'label' => 'Type 8',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'group' => 'group',
            'sortOrder' => '8',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'parents_and_children_allow',
                1 => 'parents_and_children_deny',
                2 => 'parents_allow',
                3 => 'parents_deny',
                4 => 'children_allow',
                5 => 'children_deny',
                6 => 'no_parents_and_children',
                7 => 'parents_deny_with_parent',
                8 => 'children_allow_with_child',
                9 => 'children_deny_with_child',
                10 => 'stage'
            ],
            'parents' => [
                'defaultPolicy' => 'allow',
                'types' => [
                    ['name' => 'stage', 'policy' => 'allow'],
                    ['name' => 'parents_allow_with_parent', 'policy' => 'deny']
                ]
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
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
            ]
        ],
        'parents_deny_with_parent' => [
            'name' => 'parents_deny_with_parent',
            'label' => 'Type 9',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'group' => 'group',
            'sortOrder' => '9',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'stage'
            ],
            'parents' => [
                'defaultPolicy' => 'deny',
                'types' => [
                    ['name' => 'stage', 'policy' => 'allow'],
                    ['name' => 'parents_deny_with_parent', 'policy' => 'deny']
                ]
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
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
            ]
        ],
        'children_allow_with_child' => [
            'name' => 'children_allow_with_child',
            'label' => 'Type 10',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'group' => 'group',
            'sortOrder' => '10',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'parents_and_children_allow',
                1 => 'children_allow',
                2 => 'children_allow_with_child'
            ],
            'children' => [
                'defaultPolicy' => 'allow',
                'types' => [
                    ['name' => 'parents_allow', 'policy' => 'deny'],
                    ['name' => 'children_deny', 'policy' => 'allow'],
                    ['name' => 'no_parents_and_children', 'policy' => 'deny']
                ]
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
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
            ]
        ],
        'children_deny_with_child' => [
            'name' => 'children_deny_with_child',
            'label' => 'Type 11',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'group' => 'group',
            'sortOrder' => '11',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'parents_and_children_allow',
                1 => 'children_allow',
                2 => 'children_allow_with_child'
            ],
            'children' => [
                'defaultPolicy' => 'deny',
                'types' => [
                    ['name' => 'parents_deny', 'policy' => 'allow'],
                    ['name' => 'children_allow', 'policy' => 'deny'],
                    ['name' => 'no_parents_and_children', 'policy' => 'allow']
                ]
            ],
            'appearances' => [
                'default' => [
                    'preview_template' => 'Path/to/preview/template',
                    'render_template' => 'Path/to/render/template',
                    'readers' => [],
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
            ]
        ]
    ]
];
