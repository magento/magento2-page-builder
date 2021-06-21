/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['jquery'], function ($) {
    'use strict';

    /**
     * Initialize click and input events to handle validation
     *
     * @param {Object} config
     * @param {HTMLElement} el
     */
    var GoogleMapsApiKeyValidator = function (config, el) {
        var sourceElement = $('#' + config.sourceField),
            initialValue = sourceElement.val(),
            resultElement = $('#' + config.elementId + ' > .result');

        if (initialValue) {
            $(el).attr('disabled', false);
        }

        $(el).on('click', function () {
            var resultText = config.invalidLabel,
                resultIcon = 'icon-admin-pagebuilder-error',
                resultHtml;

            $.ajax({
                url: config.validateUrl,
                showLoader: true,
                data: {
                    googleMapsApiKey: sourceElement.val()
                }
            }).done(function (data) {
                if (data.success) {
                    resultText = config.validLabel;
                    resultIcon = 'icon-admin-pagebuilder-success';
                }

                resultHtml = '<i class="' + resultIcon + '"></i> ' + resultText;
                resultElement.html(resultHtml);
            });
        });

        sourceElement.on('keyup', function (event) {
            var elementValue = event.currentTarget.value,
                buttonText = config.buttonLabel;

            $(el).attr('disabled', !elementValue);
            resultElement.html(buttonText);
        });
    };

    return GoogleMapsApiKeyValidator;
});
