/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define(function () {
    'use strict';

    var ids = 0;

    return {
        /**
         * Removes the incoming value from array in case
         * without creating a new instance of it.
         *
         * @param {Array} arr - Array to be modified.
         * @param {*} value - Value to be removed.
         * @returns {Utils} Chainable.
         */
        remove: function (arr, value) {
            var index = arr.indexOf(value);

            if (~index) {
                arr.splice(index, 1);
            }

            return this;
        },

        /**
         * Returns a probably-unique ID.
         */
        uniqueid: function() {
            return ids++ + '';
        }
    };
});
