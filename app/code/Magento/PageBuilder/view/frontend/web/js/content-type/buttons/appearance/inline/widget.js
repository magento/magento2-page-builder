/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery'
], function ($) {
    'use strict';

    /**
     * Equalize the width of a list of button-item components
     *
     * @param {JQuerySerializeArrayElement} buttonList
     */
    var equalizeButtonWidth = function (buttonList) {
        var buttonMinWidth = 0;

        buttonList.each(function () {
            var buttonWidth = this.querySelector('[data-element="link"]').offsetWidth;

            if (buttonWidth > buttonMinWidth) {
                buttonMinWidth = buttonWidth;
            }
        });
        buttonList.each(function () {
            this.querySelector('[data-element="link"]').style.width = buttonMinWidth + 'px';
        });
    };

    return function (config, element) {
        var $element = $(element);

        if ($element.attr('data-same-width') === '1') {
            equalizeButtonWidth($element.children());
        }
    };
});
