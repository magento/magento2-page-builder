const babelRc = require('./app/code/Gene/BlueFoot/view/adminhtml/web/ts/.babelrc.js');
const bebelJest = require('babel-jest');
const jestMagento = require('jest-magento2');

babelRc.presets = [{plugins: [jestMagento.babelPlugin()]}].concat(babelRc.presets);
module.exports = bebelJest.createTransformer(babelRc);
