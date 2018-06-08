/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery'
], function ($) {
    'use strict';

    return function (target) {
        $.validator.addMethod(
            'validate-google-map-style',
            function (value) {
                if ($.mage.isEmptyNoTrim(value)) {
                    return true;
                }
                try {
                    JSON.parse(value);
                } catch (e) {
                    return false;
                }
                return true;
            },
            $.mage.__('Google Maps Style JSON is invalid. Please paste the valid JSON style.')
        );

        return target;
    };
});
