/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

module.exports = {
    passPerPreset: true,
    presets: [
        {
            plugins: [
                ['@babel/plugin-proposal-class-properties', {
                    loose: true
                }]
            ]
        },
        [
            '@babel/preset-env',
            {
                loose: true,
                targets: {
                    browsers: ['last 2 versions', 'ie >= 10']
                },
                modules: 'amd'
            }
        ],
        [
            'es6-to-magento-amd',
            {
                magentoClasses: ['uiComponent', 'uiElement', 'uiClass']
            }
        ],
        {
            plugins: [
                '@babel/plugin-transform-object-assign'
            ]
        },
    ],
    plugins: [
        '@babel/plugin-transform-typescript',
        ['./babel/resolve-imports', {
            prefix: 'Magento_PageBuilder/'
        }],
        '@babel/plugin-syntax-object-rest-spread'
    ],
    ignore: [
        '/**/*.d.ts'
    ]
};
