
module.exports = function () {
    const knockout = require('::ko');
    const templateEngine = require('::Magento_Ui/js/lib/knockout/template/engine');
    require('::Magento_Ui/js/lib/knockout/bindings/bootstrap');
    require('::Magento_Ui/js/lib/knockout/extender/observable_array');
    require('::Magento_Ui/js/lib/knockout/extender/bound-nodes');

    knockout.setTemplateEngine(templateEngine);

    return knockout;
};
