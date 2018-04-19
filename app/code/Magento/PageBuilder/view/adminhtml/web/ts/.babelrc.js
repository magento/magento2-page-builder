/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

module.exports = {
    presets: [
        ['env', {
            loose: true,
            browsers: ["last 2 versions", "ie >= 11"]
        }],
        {
            plugins: [
                ["transform-class-properties", {loose: true}]
            ]
        },
        ['es6-to-magento-amd', {magentoClasses: ['uiComponent', 'uiElement', 'uiClass', 'uiEvents']}]
    ],
    plugins: [
        ['./babel/resolve-imports', {prefix: 'Magento_PageBuilder/'}],
        'transform-typescript'
    ],
    ignore: [
        "/**/*.d.ts"
    ]
};
