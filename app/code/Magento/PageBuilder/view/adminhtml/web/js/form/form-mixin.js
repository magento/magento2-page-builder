/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'jquery',
    'Magento_PageBuilder/js/events',
    'consoleLogger'
], function (_, $, events, consoleLogger) {
    'use strict';

    var mixin = {
        /**
         * Record instances of Page Builder initialized in the forms namespace
         */
        initialize: function () {
            var self = this;

            this._super();

            if (!this.source.get('pageBuilderInstances')) {
                this.source.set('pageBuilderInstances', []);
            }

            events.on('pagebuilder:register', function (data) {
                var instance;

                if (data.ns === self.ns) {
                    instance = _.findWhere(self.source.get('pageBuilderInstances'), {id: data.instance.id});
                    if (!instance) {
                        self.source.get('pageBuilderInstances').push(data.instance);
                    }
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
            var submit = this._super.bind(this, redirect, data),
                timeout,
                locks;

            if (_.isEmpty(this.source.get('pageBuilderInstances'))) {
                submit();
            } else {
                timeout = setTimeout(function () {
                    consoleLogger.error('Page Builder was rendering for 5 seconds without releasing locks.');
                }, 5000);

                $('body').trigger('processStart');

                // Wait for all rendering locks within Page Builder stages to resolve
                $.when.apply(
                    null,
                    this.source.get('pageBuilderInstances').map(function (instance) {
                        locks = instance.stage.renderingLocks;

                        return locks[locks.length - 1];
                    })
                ).then(function () {
                    $('body').trigger('processStop');
                    clearTimeout(timeout);
                    submit();
                });
            }
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});
