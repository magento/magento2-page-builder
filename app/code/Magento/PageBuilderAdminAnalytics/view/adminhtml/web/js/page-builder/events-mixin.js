/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['underscore'], function (_underscore) {
    'use strict';

    return function (target) {
        var originalTarget = target.trigger,
            isAdminAnalyticsEnabled,
            event;

        /**
         * Invokes custom code to track information regarding Page Builder usage
         *
         * @param {String} name
         * @param {Array} args
         */

        target.trigger = function (name, args) {
            originalTarget.apply(originalTarget, [name, args]);
            isAdminAnalyticsEnabled =
                !_underscore.isUndefined(window.digitalData) &&
                !_underscore.isUndefined(window._satellite);

            if (name.indexOf('readyAfter') !== -1 && isAdminAnalyticsEnabled) {
                window.digitalData.page.url = window.location.href;
                window.digitalData.page.attributes = {
                    editedWithPageBuilder: 'true'
                };
                window._satellite.track('page');
            }

            if (args.contentType !== undefined && typeof args.contentType !== undefined &&
                args.contentType.config !== undefined && typeof args.contentType.config !== undefined) {

                event = {
                    element: args.contentType.config.label,
                    type: args.contentType.config.name,
                    action: "custom-action",
                    widget: {
                        name: args.contentType.config.form,
                        type: args.contentType.config.menu_section
                    },
                    feature: "page-builder-tracker"
                };

                console.log("EVENT:", event);

                if (window.digitalData !== undefined && typeof window.digitalData !== 'undefined') {
                    window.digitalData.events.push(event);
                    window._satellite.track('event');
                }
            }
        };

        return target;
    };
});
