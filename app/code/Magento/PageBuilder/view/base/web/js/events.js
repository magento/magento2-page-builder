/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['uiEvents'], function (uiEvents) {
    'use strict';

    return {

        /**
         * Calls callback when name event is triggered
         *
         * @param {String} events
         * @param {Function} callback
         * @param {Function} ns
         * @return {Object}
         */
        on: function (events, callback, ns) {
            uiEvents.on('pagebuilder:' + events, callback, 'pagebuilder:' + ns);

            return this;
        },

        /**
         * Removed callback from listening to target event
         *
         * @param {String} ns
         * @return {Object}
         */
        off: function (ns) {
            uiEvents.off('pagebuilder:' + ns);

            return this;
        },

        /**
         * Triggers event and executes all attached callbacks
         *
         * @param {String} name
         * @param {any} args
         * @returns {Boolean}
         */
        trigger: function (name, args) {
            return uiEvents.trigger('pagebuilder:' + name, args);
        }
    };
});
