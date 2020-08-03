/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['underscore'], function (_underscore) {
    'use strict';

    return function (target) {
        var originalTarget = target.trigger,
            action = '',
            event,
            eventAttributes,
            hasVisibilityChanged,
            isAdminAnalyticsEnabled,
            setupEventAttributes;

        /**
         * Invokes custom code to track information regarding Page Builder usage
         *
         * @param {String} name
         * @param {Array} args
         */

        target.trigger = function (name, args) {
            originalTarget.apply(originalTarget, [name, args]);
            isAdminAnalyticsEnabled =
                !_underscore.isUndefined(window.digitalData) &&
                !_underscore.isUndefined(window._satellite);

            if (name.indexOf('readyAfter') !== -1 && isAdminAnalyticsEnabled) {
                window.digitalData.page.url = window.location.href;
                window.digitalData.page.attributes = {
                    editedWithPageBuilder: 'true'
                };
                window._satellite.track('page');
            }

            setupEventAttributes(name, args);

            if (action !== '' && !_underscore.isEmpty(eventAttributes)) {
                event = {
                    element: eventAttributes.label,
                    type: eventAttributes.name,
                    action: action,
                    widget: {
                        name: eventAttributes.form,
                        type: eventAttributes.menu_section
                    },
                    feature: 'page-builder-tracker'
                };

                if (isAdminAnalyticsEnabled && !_underscore.isUndefined(window.digitalData.event)) {
                    window.digitalData.event.push(event);
                    window._satellite.track('event');
                }
            }
        };

        /**
         * Sets up event attributes depending on name and args
         *
         * @param {String} name
         * @param {Array} args
         */
        setupEventAttributes = function (name, args) {
            var arrayName = name.split(':'),
                arrayNameObject;

            action = '';
            eventAttributes = {};

            if (_underscore.isUndefined(args)) {
                return;
            }

            if (arrayName.length === 3) {
                arrayNameObject = arrayName[1];
                action = hasVisibilityChanged(args[arrayNameObject]) ? 'hide/show' : '';
                eventAttributes =
                    !_underscore.isUndefined(args[arrayNameObject]) &&
                    !_underscore.isUndefined(args[arrayNameObject].config) ?
                        args[arrayNameObject].config : {};
            } else if (arrayName.length === 2) {
                if (name.indexOf('duplicateAfter') !== -1) {
                    action = 'duplicate';
                    eventAttributes =
                        !_underscore.isUndefined(args.originalContentType) &&
                        !_underscore.isUndefined(args.originalContentType.config) ?
                            args.originalContentType.config : {};
                }

                if (name.indexOf('removeAfter') !== -1) {
                    action = 'remove';
                }

                if (name.indexOf('createAfter') !== -1) {
                    action = 'create';
                }

                if (name.indexOf('renderAfter') !== -1) {
                    action = 'edit';
                }

                eventAttributes =
                    !_underscore.isUndefined(args.contentType) &&
                    !_underscore.isUndefined(args.contentType.config) ?
                        args.contentType.config : {};
            }
        };

        /**
         * Returns true when visibility has changed from previousState to state
         *
         * @param {Object} objectWrapper
         */
        hasVisibilityChanged = function (objectWrapper) {
            var state,
                previousState;

            if (!_underscore.isUndefined(objectWrapper) &&
                !_underscore.isUndefined(objectWrapper).dataStore
            ) {
                previousState = !_underscore.isUndefined(objectWrapper.dataStore.previousState) ?
                    objectWrapper.dataStore.previousState.display : '';
                state = !_underscore.isUndefined(objectWrapper.dataStore.state) ?
                    objectWrapper.dataStore.state.display : '';

                if (previousState !== state && previousState !== '' && state !== '') {
                    return true;
                }
            }

            return false;
        };

        return target;
    };
});
