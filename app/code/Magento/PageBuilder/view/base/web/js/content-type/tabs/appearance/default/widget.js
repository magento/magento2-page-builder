/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'Magento_PageBuilder/js/events',
    'jquery-ui-modules/tabs'
], function ($, events) {
    'use strict';

    return function (config, element) {
        var $element = $(element);

        // Ignore stage builder preview tabs
        if ($element.is('.pagebuilder-tabs')) {
            return;
        }

        // Disambiguate between the mage/tabs component which is loaded randomly depending on requirejs order.
        $.ui.tabs({
            active: $element.data('activeTab') || 0,
            create:

                /**
                 * Adjust the margin bottom of the navigation to correctly display the active tab
                 */
                function () {
                    var borderWidth = parseInt($element.find('.tabs-content').css('borderWidth').toString(), 10);

                    $element.find('.tabs-navigation').css('marginBottom', -borderWidth);
                    $element.find('.tabs-navigation li:not(:first-child)').css('marginLeft', -borderWidth);
                },
            activate:

                /**
                 * Trigger redraw event since new content is being displayed
                 */
                function () {
                    events.trigger('contentType:redrawAfter', {
                        element: element
                    });
                }
        }, element);
    };
});
