const magentoClasses = require('./magentoClasses');

module.exports = {
    presets: [
        ['es6-to-magento-amd', {magentoClasses: magentoClasses}]
    ],
    plugins: ['transform-typescript']
};
