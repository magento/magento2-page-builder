/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * @api
 */
define([
    'underscore',
    'jquery',
    'mage/apply/main'
], function (_, $, mage) {
    'use strict';

    /**
     * Initializes components assigned to HTML elements.
     *
     *
     * @param {HTMLElement} el
     * @param {Array} data
     */
    function initializeWidget(el, data) {
        _.each(data, function (config, component) {
            mage.applyFor(el, config, component);
        });
    }

    return function (data) {
        _.each(data.config, function (componentConfiguration, elementPath) {
            $(elementPath).each(function (index, element) {
                initializeWidget(element, componentConfiguration);
            });
        });
    };
});
