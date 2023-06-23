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
     * Validate that string has a widget
     * @param {String} str
     * @return {Boolean}
     */
    function validateWysiwygHasWidget(str) {
        return (/\{\{widget(.*?)\}\}/ig).test(str);
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
     * Validate message field and url field html standards, nested widget
     * @param {String} message
     * @param {Object} url
     * @return {Boolean}
     */
    function validateNestedWidgetElement(message, url) {
        return !(validateWysiwygHasWidget(message) &&
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
                var allNumbers = true,
                    handler = rule.handler.bind(this);

                if (typeof value !== 'object') {
                    return handler(value, params);
                }

                _.flatten(_.map(value, _.values)).forEach(function (val) {
                    if (!handler(val, params)) {
                        allNumbers = false;

                        return allNumbers;
                    }
                });

                return allNumbers;
            },
            $.mage.__(rule.message)
        );
    }

    /**
     * Validate calc value.
     *
     * @param {String} value
     * @returns {Boolean}
     */
    function validateCalc(value) {
        var el = document.createElement('div'),
            style = el.style;

        if (!value.trim().length) {
            return true;
        }

        style.width = 'calc(' + value + ')';

        return !!style.width.length;
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
            'validate-video-source',
            function (href) {
                if (utils.isEmptyNoTrim(href)) {
                    return true;
                }

                href = (href || '').replace(/^\s+/, '').replace(/\s+$/, '');

                return validateIsUrl(href) && (
                    href.match(/youtube\.com|youtu\.be/) ||
                    href.match(/vimeo\.com/) ||
                    href.match(/\.(mp4|ogv|webm)(?!\w)/)
                );
            },
            $.mage.__('Please enter a valid video URL. Valid URLs have a video file extension (.mp4, .webm, .ogv) or links to videos on YouTube or Vimeo.')//eslint-disable-line max-len
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
                if (value !== null && typeof value === 'object' && !!(value.padding || value.margin)) {
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

        validator.addRule(
            'validate-message-no-widget',
            function (url, message) {
                return validateNestedWidgetElement(message, url);
            },
            $.mage.__('Adding link in outer element and widget in content is not allowed.')
        );

        validator.addRule(
            'validate-no-widget',
            function (message, url) {
                return validateNestedWidgetElement(message, url);
            },
            $.mage.__('Adding widget in content and link in outer element is not allowed.')
        );

        validator.addRule(
            'validate-calc',
            function (value) {
                return validateCalc(value);
            },
            $.mage.__('Please enter a valid number or calculation: Valid numbers must have an extension (px, %, pt, vh). Calculations must have white space around the + and - operators and cannot divide by zero.')//eslint-disable-line max-len
        );

        validator.addRule(
            'validate-grid-size',
            function (value, params, additionalParams) {
                if (value < additionalParams.non_empty_column_count) {
                    return false;
                }

                return true;
            },
            $.mage.__('Grid size cannot be smaller than the current total amount of columns, minus any empty columns.')
        );

        validator.addRule(
            'validate-max-grid-size',
            function (value, params, additionalParams) {
                if (value > additionalParams.max_grid_size) {
                    return false;
                }

                return true;
            },
            $.mage.__('Please enter a value less than or equal to the Maximum Column Grid Size configuration.')
        );

        validateObjectField(validator, 'validate-number');
        validateObjectField(validator, 'less-than-equals-to');
        validateObjectField(validator, 'greater-than-equals-to');

        return validator;
    };
});
