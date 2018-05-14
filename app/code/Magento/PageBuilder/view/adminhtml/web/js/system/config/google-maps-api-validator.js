/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['jquery'], function($) {
    'use strict';

    var GoogleMapsApiValidation = function(config, el) {
        $(el).click(function() {
            var sourceElement = $('#' + config.sourceField),
                resultElement = $('#' + config.elementId + ' > .result'),
                resultText = config.invalidLabel,
                resultIcon = 'icon-admin-pagebuilder-error',
                resultHtml;

            $.ajax({
                url: config.validationEndpoint,
                showLoader: true,
                data: { key: sourceElement.val() }
            }).done(function(data) {
                if (data.success) {
                    resultText = config.validLabel;
                    resultIcon = 'icon-admin-pagebuilder-success';
                }

                resultHtml = '<i class="' + resultIcon + '"></i> ' + resultText;
                resultElement.html(resultHtml);
            });
        });
    };

    return GoogleMapsApiValidation;
});
