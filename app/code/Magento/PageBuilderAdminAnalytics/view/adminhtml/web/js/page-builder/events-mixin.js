/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['underscore'], function (_) {
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
                !_.isUndefined(window.digitalData) &&
                !_.isUndefined(window._satellite);

            if (name.indexOf('readyAfter') !== -1 && isAdminAnalyticsEnabled) {
                window.digitalData.page.url = window.location.href;
                window.digitalData.page.attributes = {
                    editedWithPageBuilder: 'true'
                };
                window._satellite.track('page');
            }

            setupEventAttributes(name, args);

            if (action !== '' && !_.isEmpty(eventAttributes)) {
                event = {
                    element: eventAttributes.label,
                    type: eventAttributes.name,
                    action: action,
                    widget: {
                        name: eventAttributes.form,
                        type: eventAttributes['menu_section']
                    },
                    feature: 'page-builder-tracker'
                };

                if (isAdminAnalyticsEnabled && !_.isUndefined(window.digitalData.event)) {
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

            if (_.isUndefined(args)) {
                return;
            }

            if (arrayName.length === 3) {
                arrayNameObject = arrayName[1];
                action = hasVisibilityChanged(args[arrayNameObject]) ? 'hide/show' : '';
                eventAttributes =
                    !_.isUndefined(args[arrayNameObject]) &&
                    !_.isUndefined(args[arrayNameObject].config) ?
                        args[arrayNameObject].config : {};
            } else if (arrayName.length === 2) {
                switch (arrayName[arrayName.length - 1]) {
                    case 'duplicateAfter':
                        action = 'duplicate';
                        eventAttributes =
                            !_.isUndefined(args.originalContentType) &&
                            !_.isUndefined(args.originalContentType.config) ?
                                args.originalContentType.config : {};
                        break;

                    case 'removeAfter':
                        action = 'remove';
                        break;

                    case 'createAfter':
                        action = 'create';
                        break;

                    case 'renderAfter':
                        action = 'edit';
                        break;

                    default:
                        break;
                }

                eventAttributes =
                    !_.isUndefined(args.contentType) &&
                    !_.isUndefined(args.contentType.config) ?
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

            if (!_.isUndefined(objectWrapper) &&
                !_.isUndefined(objectWrapper).dataStore
            ) {
                previousState = !_.isUndefined(objectWrapper.dataStore.previousState) ?
                    objectWrapper.dataStore.previousState.display : '';
                state = !_.isUndefined(objectWrapper.dataStore.state) ?
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
