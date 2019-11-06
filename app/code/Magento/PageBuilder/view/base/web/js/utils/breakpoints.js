/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore'
], function (_) {
    'use strict';

    return {
        /**
         * Build media query.
         *
         * @param {Object} conditions
         * @returns {String}
         */
        buildMedia: function (conditions) {
            var result = _.map(_.pairs(conditions), function (condition) {
                return '(' + condition.join(': ') + ')';
            });

            return result.join(' and ');
        }
    };
});
