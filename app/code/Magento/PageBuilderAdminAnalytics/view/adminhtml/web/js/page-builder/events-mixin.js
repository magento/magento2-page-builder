/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['underscore'], function (_underscore) {
    'use strict';

    return function (target) {
        var originalTarget = target.trigger,
            isPageBuilderEnabled =
                !_underscore.isUndefined(window.digitalData) &&
                !_underscore.isUndefined(window._satellite);

        /**
         * Invokes custom code to track information regarding Page Builder usage
         *
         * @param {String} name
         * @param {Array} args
         */

        target.trigger = function (name, args) {
            originalTarget.apply([originalTarget, name, args]);

            if (name.indexOf('readyAfter') !== -1 && isPageBuilderEnabled) {
                window.digitalData.page.url = window.location.href;
                window.digitalData.page.attributes = {
                    editedWithPageBuilder: 'true'
                };
                window._satellite.track('page');
            }
        };

        return target;
    };
});
