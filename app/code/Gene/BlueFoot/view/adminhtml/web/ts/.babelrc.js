const magentoClasses = require('./magentoClasses');

module.exports = {
    presets: [
        {
            plugins: ['transform-class-properties']
        },
        ['es6-to-magento-amd', {magentoClasses: magentoClasses}]
    ],
    plugins: ['transform-typescript']
};
