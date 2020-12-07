/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['underscore', 'Magento_PageBuilderAdminAnalytics/js/page-builder/event-builder'],
    function (_, EventBuilder) {
        'use strict';

        return function (target) {
            var originalTarget = target.trigger,
                isAdminAnalyticsEnabled,
                event,
                hasPageBuilderBeenUsed = false,
                delayedPush;

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

                if (!hasPageBuilderBeenUsed && name.indexOf('stage:fullScreenModeChangeAfter') !== -1 &&
                    args.fullScreen && isAdminAnalyticsEnabled
                ) {
                    hasPageBuilderBeenUsed = true;
                    window.digitalData.page.url = window.location.href;
                    window.digitalData.page.attributes = {
                        editedWithPageBuilder: 'true'
                    };
                    window._satellite.track('page');
                }

                event = EventBuilder.build(name, args);

                if (isAdminAnalyticsEnabled && !_.isUndefined(window.digitalData.event) && !_.isUndefined(event)) {
                    delayedPush = setInterval(function (object) {
                        if (_.isArray(window.digitalData.event)) {
                            window.digitalData.event.push(object);
                            window._satellite.track('event');
                            clearInterval(delayedPush);
                        }
                    }, 500, event);
                }
            };

            return target;
        };
    });
