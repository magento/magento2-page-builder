define([
    'jquery',
    'Magento_Rule/rules',
    'uiRegistry',
    'mage/utils/objects'
], function ($, RulesForm, uiRegistry, objectUtils) {
    'use strict';

    return function (config, conditionsFormPlaceholder) {
        var $conditionsFormPlaceholder = $(conditionsFormPlaceholder),
            attributeData = uiRegistry.get(config.formNamespace + '.' + config.formNamespace).source.data,
            conditions = objectUtils.nested(attributeData, config.attribute) || '[]';

        $('body').trigger('processStart');

        $.ajax(config.componentUrl, {
            method: 'POST',
            data: {
                conditions: conditions
            }
        })
        .done(function (response) {
            $conditionsFormPlaceholder.html(response);
            window[config.jsObjectName] = new RulesForm(config.jsObjectName, config.childComponentUrl);
            $('body').trigger('processStop');
        });
    };
});
