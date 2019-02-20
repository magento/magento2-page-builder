/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['jquery'], function ($) {
    'use strict';

    /**
     * Show the overlay on hover of specific elements
     *
     * @param {JQuery<Element>[]} $elements
     */
    function showOverlayOnHover($elements) {
        $elements.each(function (index, element) {
            var overlayEl = $(element).find('.pagebuilder-overlay'),
                overlayColor = overlayEl.attr('data-overlay-color');

            $(element).hover(
                function () {
                    overlayEl.css('background-color', overlayColor);
                },
                function () {
                    overlayEl.css('background-color', 'transparent');
                }
            );
        });
    }

    /**
     * Show button on hover of specific elements
     *
     * @param {JQuery<Element>[]} $elements
     * @param {String} buttonClass
     */
    function showButtonOnHover($elements, buttonClass) {
        $elements.each(function (index, element) {
            var buttonEl = $(element).find(buttonClass);

            $(element).hover(
                function () {
                    buttonEl.css({
                        'opacity': '1',
                        'visibility': 'visible'
                    });
                }, function () {
                    buttonEl.css({
                        'opacity': '0',
                        'visibility': 'hidden'
                    });
                }
            );
        });
    }

    return function (config) {

        var buttonSelector = config.buttonSelector,
            overlayHoverSelector = 'div[data-content-type="%s"][data-show-overlay="%s"]'
                .replace('%s', config.dataRole)
                .replace('%s', config.showOverlay),
            overlayButtonSelector = 'div[data-content-type="%s"][data-show-button="%s"]'
                .replace('%s', config.dataRole)
                .replace('%s', config.showOverlay);

        showOverlayOnHover($(overlayHoverSelector));
        showButtonOnHover($(overlayButtonSelector), buttonSelector);
    };
});
