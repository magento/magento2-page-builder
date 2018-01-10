const babelRc = require('./app/code/Magento/PageBuilder/view/adminhtml/ts/.babelrc.js');
const bebelJest = require('babel-jest');
const jestMagento = require('jest-magento2');

babelRc.presets = [{plugins: [jestMagento.babelPlugin()]}].concat(babelRc.presets);
module.exports = bebelJest.createTransformer(babelRc);
