/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['underscore'], function (_underscore) {
    'use strict';

    return function (target) {
        var originalTarget = target.trigger,
            isAdminAnalyticsEnabled,
            action = '',
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

            console.log(name, args);

            if (name.indexOf('readyAfter') !== -1 && isAdminAnalyticsEnabled) {
                window.digitalData.page.url = window.location.href;
                window.digitalData.page.attributes = {
                    editedWithPageBuilder: 'true'
                };
                window._satellite.track('page');
            }

            if (name.indexOf('duplicateAfter') !== -1) action='duplicate';
            if (name.indexOf('removeAfter') !== -1) action='remove';
            if (name.indexOf('createAfter') !== -1) action='create';

            if (!_underscore.isUndefined(args) && !_underscore.isUndefined(args.contentType) &&
                !_underscore.isUndefined(args.contentType.config && action !== '')
            ) {
                event = {
                    element: args.contentType.config.label,
                    type: args.contentType.config.name,
                    action: action,
                    widget: {
                        name: args.contentType.config.form,
                        type: args.contentType.config.menu_section
                    },
                    feature: 'page-builder-tracker'
                };

                console.log('EVENT:', event);

                if (isAdminAnalyticsEnabled && !_underscore.isUndefined(window.digitalData.event)) {
                    window.digitalData.event.push(event);
                    window._satellite.track('event');
                }
            }
        };

        return target;
    };
});
