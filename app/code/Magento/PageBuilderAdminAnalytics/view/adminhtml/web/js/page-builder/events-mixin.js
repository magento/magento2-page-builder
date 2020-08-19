/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['underscore', "Magento_PageBuilderAdminAnalytics/js/page-builder/event-builder"],
    function (_, EventBuilder) {
    'use strict';

    return function (target) {
        var originalTarget = target.trigger,
            event,
            isAdminAnalyticsEnabled;

        /**
         * Invokes custom code to track information regarding Page Builder usage
         *
         * @param {String} name
         * @param {Array} args
         */

        target.trigger = function (name, args) {
            originalTarget.apply(originalTarget, [name, args]);
            isAdminAnalyticsEnabled =
                !_.isUndefined(window.digitalData) &&
                !_.isUndefined(window._satellite);

            if (name.indexOf('readyAfter') !== -1 && isAdminAnalyticsEnabled) {
                window.digitalData.page.url = window.location.href;
                window.digitalData.page.attributes = {
                    editedWithPageBuilder: 'true'
                };
                window._satellite.track('page');
            }

            var event = EventBuilder.build(name, args);

            // if (eventAttributes.action !== '' && !_.isEmpty(eventAttributes)) {
            //     event = {
            //         element: eventAttributes.label,
            //         type: eventAttributes.name,
            //         action: eventAttributes.action,
            //         widget: {
            //             name: eventAttributes.form,
            //             type: eventAttributes['menu_section']
            //         },
            //         feature: 'page-builder-tracker'
            //     };

                if (isAdminAnalyticsEnabled &&
                    !_.isUndefined(window.digitalData.event) &&
                    !_.isEmpty(event)) {
                    window.digitalData.event.push(event);
                    window._satellite.track('event');
                }
            //}
        };

        return target;
    };
});
