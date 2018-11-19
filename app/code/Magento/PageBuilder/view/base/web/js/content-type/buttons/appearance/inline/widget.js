/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'Magento_PageBuilder/js/events'
], function ($, events) {
    'use strict';

    /**
     * Equalize the width of a list of button-item components
     *
     * @param {JQuery} buttonList
     */
    var equalizeButtonWidth = function (buttonList) {
        var buttonMinWidth = 0;

        buttonList.css('min-width', buttonMinWidth);
        buttonList.each(function () {
            var buttonWidth = this.offsetWidth;

            if (buttonWidth > buttonMinWidth) {
                buttonMinWidth = buttonWidth;
            }
        });
        buttonList.css('min-width', buttonMinWidth);
    };

    return function (config, element) {
        var $element = $(element),
            buttonSelector = '[data-element="link"], [data-element="empty_link"]';

        if ($element.data('sameWidth')) {
            equalizeButtonWidth($element.find(buttonSelector));
            $(window).resize(function () {
                equalizeButtonWidth($element.find(buttonSelector));
            });
            events.on('contentType:redrawAfter', function (eventData) {
                if ($element.closest(eventData.element).length > 0) {
                    equalizeButtonWidth($element.find(buttonSelector));
                }
            });
        }
    };
});
