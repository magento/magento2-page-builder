const magentoClasses = require('./magentoClasses');

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
        ['es6-to-magento-amd', {magentoClasses: magentoClasses}],
        'typescript'
    ],
    ignore: [
        "/**/*.d.ts"
    ]
};
