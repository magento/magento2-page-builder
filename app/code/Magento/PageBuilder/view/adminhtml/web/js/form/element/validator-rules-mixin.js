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
        return (/^(http|https|ftp):\/\/(([A-Z0-9]([A-Z0-9_-]*[A-Z0-9]|))(\.[A-Z0-9]([A-Z0-9_-]*[A-Z0-9]|))*)(:(\d+))?(\/[A-Z0-9~](([A-Z0-9_~-]|\.)*[A-Z0-9~]|))*\/?(.*)?$/i).test(href);//eslint-disable-line max-len
    }

    /**
     * Validate that string has an anchor tag
     * @param {String} str
     * @return {Boolean}
     */
    function validateWysiwygHasAnchorTags(str) {
        return (/<a[\s]+([^>]+)>|<a>|<\/a>/igm).test(str);
    }

    /**
     * Validate that string is a proper css-class
     * @param {String} str
     * @return {Boolean}
     */
    function validateCssClass(str) {
        return (/^[a-zA-Z _\-\d]+$/i).test(str);
    }

    /**
     * Validate message field and url field anchor tag is used exclusively by one field
     * @param {String} message
     * @param {Object} url
     * @return {Boolean}
     */
    function validateOneAnchorTagField(message, url) {
        return !(validateWysiwygHasAnchorTags(message) &&
            ['page', 'product', 'category', 'default'].indexOf(url.type) !== -1 &&
            url[url.type] &&
            url[url.type].length > 0);
    }

    /**
     * Validate a field with an expected data value of type object, like margins_and_padding field
     * @param {Function} validator
     * @param {String} ruleName
     */
    function validateObjectField(validator, ruleName) {
        var rule = validator.getRule(ruleName);

        validator.addRule(
            ruleName,
            function (value, params) {
                var allNumbers = true;

                if (typeof value !== 'object') {
                    return rule.handler(value, params);
                }

                _.flatten(_.map(value, _.values)).forEach(function (val) {
                    if (!rule.handler(val, params)) {
                        allNumbers = false;

                        return allNumbers;
                    }
                });

                return allNumbers;
            },
            $.mage.__(rule.message)
        );
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
            'validate-css-class',
            function (value) {
                if (utils.isEmptyNoTrim(value)) {
                    return true;
                }

                return validateCssClass(value);
            },
            $.mage.__('Please enter a valid CSS class.')
        );

        validator.addRule(
            'required-entry',
            function (value) {
                var allFilled;

                // Validation only for margins and paddings
                if (typeof value === 'object' && !!(value.padding || value.margin)) {
                    allFilled = true;

                    _.flatten(_.map(value, _.values)).forEach(function (val) {
                        if (utils.isEmpty(val)) {
                            allFilled = false;

                            return allFilled;
                        }
                    });

                    return allFilled;
                }

                return requiredInputRule.handler(value);
            },
            $.mage.__(requiredInputRule.message)
        );

        validator.addRule(
            'validate-message-no-link',
            function (url, message) {
                return validateOneAnchorTagField(message, url);
            },
            $.mage.__('Adding link in both content and outer element is not allowed.')
        );

        validator.addRule(
            'validate-no-url',
            function (message, url) {
                return validateOneAnchorTagField(message, url);
            },
            $.mage.__('Adding link in both content and outer element is not allowed.')
        );

        validateObjectField(validator, 'validate-number');
        validateObjectField(validator, 'less-than-equals-to');
        validateObjectField(validator, 'greater-than-equals-to');

        return validator;
    };
});
