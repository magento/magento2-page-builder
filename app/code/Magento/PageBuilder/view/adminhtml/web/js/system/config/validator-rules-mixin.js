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

        $.validator.addMethod(
            'validate-greater-than-one',
            function (value) {
                return !(value <= 1);
            },
            $.mage.__('Please enter a number 2 or greater in this field.')
        );

        $.validator.addMethod(
            'validate-default-grid-size',
            function (value) {
                return !(parseInt(value, 10) >
                    parseInt($('[name="groups[pagebuilder][fields][column_grid_max][value]"]').val(), 10)
                );
            },
            $.mage.__('Default grid size must be less than the maximum grid size.')
        );

        return target;
    };
});
