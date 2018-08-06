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
     * @param {JQuery} buttonList
     */
    var equalizeButtonWidth = function (buttonList) {
        var buttonMinWidth = 0;

        buttonList.each(function () {
            var buttonWidth = this.offsetWidth;

            if (buttonWidth > buttonMinWidth) {
                buttonMinWidth = buttonWidth;
            }
        });
        buttonList.css('width', buttonMinWidth);
    };

    return function (config, element) {
        var $element = $(element);

        if ($element.data('sameWidth')) {
            equalizeButtonWidth($element.find('[data-element="link"]'));
        }
    };
});
