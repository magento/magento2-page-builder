/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['jquery', 'underscore', 'Magento_PageBuilder/js/events', 'consoleLogger'], function ($, _, events, consoleLogger) {
    'use strict';

    var mixin = {
        defaults: {
            pageBuilderInstances: [],
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
                superFunction = this._super,
                submit = function () {
                    superFunction.apply(self, [redirect, data]);
                };

            if (this.pageBuilderInstances.length > 0) {
                let locks = this.pageBuilderInstances.map(function (instance) {
                    if (instance.stage.renderingLock && !_.isUndefined(instance.stage.renderingLock.promise)) {
                        return instance.stage.renderingLock.promise;
                    }
                }).filter(function (promise) {
                    return promise !== undefined;
                });

                if (locks.length === 0) {
                    submit();
                } else {
                    var timeout = setTimeout(function () {
                        consoleLogger.error("Page Builder was rendering for 5 seconds without releasing locks.");
                    }, 5000);

                    $('body').trigger('processStart');
                    Promise.all(locks).then(function () {
                        $('body').trigger('processStop');
                        clearTimeout(timeout);
                        submit();
                    });
                }
            } else {
                submit();
            }
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});
