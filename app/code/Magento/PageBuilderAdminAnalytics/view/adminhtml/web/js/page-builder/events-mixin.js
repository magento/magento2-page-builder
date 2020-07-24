/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['underscore'], function (_underscore) {
    'use strict';

    return function (target) {
        var originalTarget = target.trigger;

        /**
         * Invokes custom code to track information regarding Page Builder usage
         *
         * @param {String} name
         * @param {Array} args
         */

        target.trigger = function (name, args) {
            originalTarget.apply([originalTarget, name, args]);

            if (name.indexOf('readyAfter') !== -1 &&
                !_underscore.isUndefined(window.digitalData)
            ) {
                console.log(222);
                window.digitalData.page.url = window.location.href;
                window.digitalData.page.attributes = {
                    editedWithPageBuilder: 'true'
                };

                if (!_underscore.isUndefined(window._satellite)) {
                    console.log(333);
                    window._satellite.track('page');
                }
            }
        };

        return target;
    };
});
