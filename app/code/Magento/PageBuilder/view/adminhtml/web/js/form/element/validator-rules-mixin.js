/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'underscore',
    'Magento_Ui/js/lib/validation/utils'
], function ($, _, utils) {
    'use strict';

    /**
     * Validate the number is between the min and max provided
     *
     * @param {Number} value
     * @param {Number} min
     * @param {Number} max
     * @return {Boolean}
     */
    function validateNumberBetween(value, min, max) {
        var numValue;

        if ($.mage.isEmptyNoTrim(value)) {
            return true;
        }

        numValue = $.mage.parseNumber(value);

        if (isNaN(numValue)) {
            return false;
        }

        return $.mage.isBetween(numValue, min, max);
    }

    /**
     * Validate that string is url
     * @param {String} href
     * @return {Boolean}
     */
    function validateIsUrl(href) {

        return (/^(http|https|ftp):\/\/(([A-Z0-9]([A-Z0-9_-]*[A-Z0-9]|))(\.[A-Z0-9]([A-Z0-9_-]*[A-Z0-9]|))*)(:(\d+))?(\/[A-Z0-9~](([A-Z0-9_~-]|\.)*[A-Z0-9~]|))*\/?(.*)?$/i).test(href)//eslint-disable-line max-len);
    }

    return function (validator) {
        var requiredInputRule = validator.getRule('required-entry');

        validator.addRule(
            'required-entry-location-name',
            requiredInputRule.handler,
            $.mage.__('Please enter the location name.')
        );

        validator.addRule(
            'required-entry-latitude',
            requiredInputRule.handler,
            $.mage.__('Enter latitude')
        );

        validator.addRule(
            'required-entry-longitude',
            requiredInputRule.handler,
            $.mage.__('Enter longitude')
        );

        validator.addRule(
            'validate-latitude',
            function (value) {
                return validateNumberBetween(value, -85, 85);
            },
            $.mage.__('Please enter a number between -85 and 85')
        );

        validator.addRule(
            'validate-longitude',
            function (value) {
                return validateNumberBetween(value, -180, 180);
            },
            $.mage.__('Please enter a number between -180 and 180')
        );

        validator.addRule(
            'validate-video-url',
            function (href) {
                if (utils.isEmptyNoTrim(href)) {
                    return true;
                }

                href = (href || '').replace(/^\s+/, '').replace(/\s+$/, '');

                return validateIsUrl(href) && (href.match(/youtube\.com|youtu\.be/) || href.match(/vimeo\.com/));
            },
            $.mage.__('Please enter a valid video URL.')
        );

        validator.addRule(
            'required-entry',
            function (value) {
                if (typeof value !== 'object') {
                    return requiredInputRule.handler(value);
                }
                return !_.contains(_.flatten(_.map(value, _.values)), "");
            },
            $.mage.__(requiredInputRule.message)
        );

        return validator;
    };
});
