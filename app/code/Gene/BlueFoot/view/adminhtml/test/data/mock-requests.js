/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([], function () {
    'use strict';
    return {
        /**
         * /testConfig mock request for testing config.js
         *
         * @param params
         * @returns {*}
         */
        '/testConfig': function (params) {
            if (typeof params.entityIds === 'object') {
                return {
                    success: true,
                    responseText: '{"1":true}'
                };
            }

            return {
                success: true,
                responseText: '{"success":true}'
            };
        }
    };
});