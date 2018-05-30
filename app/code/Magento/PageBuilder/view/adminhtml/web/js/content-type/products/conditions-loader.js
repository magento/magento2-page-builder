define([
    'jquery',
    'Magento_Rule/rules',
    'uiRegistry',
    'prototype'
], function ($, RulesForm, uiRegistry) {
    'use strict';

    return function (config, conditionsFormPlaceholder) {
        var $conditionsFormPlaceholder = $(conditionsFormPlaceholder),
            conditions = uiRegistry.get(config.formNamespace + '.' + config.formNamespace).source.data['conditions_encoded'] || '[]';
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
