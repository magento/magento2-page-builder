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
            'menu_section' => 'menu_section',
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
            ]
        ],
        'parents_and_children_deny' => [
            'name' => 'parents_and_children_deny',
            'label' => 'Type 2',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'menu_section' => 'menu_section',
            'sortOrder' => '2',
            'translate' => 'label',
            'allowed_parents' => []
        ],
        'parents_allow' => [
            'name' => 'parents_allow',
            'label' => 'Type 3',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'menu_section' => 'menu_section',
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
            ]
        ],
        'parents_deny' => [
            'name' => 'parents_deny',
            'label' => 'Type 4',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'menu_section' => 'menu_section',
            'sortOrder' => '4',
            'translate' => 'label',
            'allowed_parents' => [],
        ],
        'children_allow' => [
            'name' => 'children_allow',
            'label' => 'Type 5',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'menu_section' => 'menu_section',
            'sortOrder' => '5',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'parents_and_children_allow',
                1 => 'children_allow',
                2 => 'children_allow_with_child'
            ]
        ],
        'children_deny' => [
            'name' => 'children_deny',
            'label' => 'Type 6',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'menu_section' => 'menu_section',
            'sortOrder' => '6',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'parents_and_children_allow',
                1 => 'children_allow',
                2 => 'children_allow_with_child'
            ]
        ],
        'no_parents_and_children' => [
            'name' => 'no_parents_and_children',
            'label' => 'Type 7',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'menu_section' => 'menu_section',
            'sortOrder' => '7',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'parents_and_children_allow',
                1 => 'children_allow',
                2 => 'children_deny_with_child'
            ]
        ],
        'parents_allow_with_parent' => [
            'name' => 'parents_allow_with_parent',
            'label' => 'Type 8',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'menu_section' => 'menu_section',
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
            ]
        ],
        'parents_deny_with_parent' => [
            'name' => 'parents_deny_with_parent',
            'label' => 'Type 9',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'menu_section' => 'menu_section',
            'sortOrder' => '9',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'stage'
            ]
        ],
        'children_allow_with_child' => [
            'name' => 'children_allow_with_child',
            'label' => 'Type 10',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'menu_section' => 'menu_section',
            'sortOrder' => '10',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'parents_and_children_allow',
                1 => 'children_allow',
                2 => 'children_allow_with_child'
            ]
        ],
        'children_deny_with_child' => [
            'name' => 'children_deny_with_child',
            'label' => 'Type 11',
            'icon' => 'pagebuilder-type-icon',
            'component' => 'Path/to/component',
            'form' => 'pagebuilder_type_form',
            'menu_section' => 'menu_section',
            'sortOrder' => '11',
            'translate' => 'label',
            'allowed_parents' => [
                0 => 'parents_and_children_allow',
                1 => 'children_allow',
                2 => 'children_allow_with_child'
            ]
        ]
    ]
];
