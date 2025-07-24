/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */
define([
    'jquery',
    'Magento_Rule/rules',
    'uiRegistry',
    'mage/utils/objects'
], function ($, RulesForm, uiRegistry, objectUtils) {
    'use strict'; // eslint-disable-line strict

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
        }).done(function (response) {
            $conditionsFormPlaceholder.html(response);
            window[config.jsObjectName] = new RulesForm(config.jsObjectName, config.childComponentUrl);
            $('body').trigger('processStop');
        }).fail(function (response) {
            if (response.status === 403) {
                $('body').notification('clear');
                $('body').notification('add', {
                    error: true,
                    message: $.mage.__(
                        'Forbidden. You do not have permission to perform this action.'
                    ),
                    insertMethod: function (message) {
                        var $wrapper = $('<div></div>').html(message);

                        $('.page-main-actions').after($wrapper);
                    }
                });
                $('.save.primary').attr('disabled', true);
                $('body').trigger('processStop');
            }
            this.loading(false);
        });
    };
});
