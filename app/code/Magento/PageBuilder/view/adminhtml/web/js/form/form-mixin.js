/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['jquery', 'Magento_PageBuilder/js/events', 'consoleLogger', 'Magento_PageBuilder/js/stage'], function ($, events, consoleLogger, stage) {
    'use strict';

    var mixin = {
        defaults: {
            pageBuilderInstances: []
        },

        /**
         * Record instances of Page Builder initialized in the forms namespace
         */
        initialize: function () {
            var self = this;

            this._super();

            events.on('pagebuilder:register', function (data) {
                if (data.ns === self.ns) {
                    self.pageBuilderInstances.push(data.instance);
                }
            });

            return this;
        },

        /**
         * Intercept save call to ensure any Page Builder rendering is completed before submitting form
         *
         * @param {String} redirect
         * @param {Object} data
         */
        save: function (redirect, data) {
            var self = this,
                submit = this._super.bind(self, redirect, data),
                locks,
                timeout;

            if (this.pageBuilderInstances.length === 0) {
                submit();
            } else {
                locks = this.pageBuilderInstances.map(function (instance) {
                    return instance.stage.renderingLock;
                });

                if (locks.length === 0) {
                    submit();
                } else {
                    stage.debugLog('Lock detected, waiting for resolution');
                    timeout = setTimeout(function () {
                        consoleLogger.error('Page Builder was rendering for 5 seconds without releasing locks.');
                    }, 5000);

                    $('body').trigger('processStart');
                    $.when.apply(null, locks).then(function () {
                        stage.debugLog('Resolved lock, saving');
                        $('body').trigger('processStop');
                        clearTimeout(timeout);
                        submit();
                    });
                }
            }
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});
