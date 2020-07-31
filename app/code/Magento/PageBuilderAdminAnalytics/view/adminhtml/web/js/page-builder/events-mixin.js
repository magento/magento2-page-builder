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
            getAction,
            isAdminAnalyticsEnabled,
            hasVisibilityChanged,
            objectToCheck;

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
            objectToCheck = '';

            if (name.indexOf('readyAfter') !== -1 && isAdminAnalyticsEnabled) {
                window.digitalData.page.url = window.location.href;
                window.digitalData.page.attributes = {
                    editedWithPageBuilder: 'true'
                };
                window._satellite.track('page');
            }

            console.log("antes", name);
            action = getAction(name, args);

            if (objectToCheck === '') objectToCheck = args.contentType;

            if (!_underscore.isUndefined(args) && !_underscore.isUndefined(args.contentType) &&
                !_underscore.isUndefined(objectToCheck.config) && action !== ''
            ) {
                console.log('justo antes de event');
                event = {
                    element: objectToCheck.config.label,
                    type: objectToCheck.config.name,
                    action: action,
                    widget: {
                        name: objectToCheck.config.form,
                        type: objectToCheck.config.menu_section
                    },
                    feature: 'page-builder-tracker'
                };

                console.log('dentro', event);

                if (isAdminAnalyticsEnabled && !_underscore.isUndefined(window.digitalData.event)) {
                    window.digitalData.event.push(event);
                    window._satellite.track('event');
                }
            }
        };

        getAction = function (name, args) {
            var triggeredAction = '',
                arrayName,
                arrayNameObject;

            if (name.indexOf('duplicateAfter') !== -1) triggeredAction = 'duplicate';

            if (name.indexOf('removeAfter') !== -1) triggeredAction = 'remove';

            if (name.indexOf('createAfter') !== -1) triggeredAction = 'create';

            if (name.indexOf('renderAfter') !== -1) triggeredAction = 'edit';

            if (name.indexOf('updateAfter') !== -1) {
                arrayName = name.split(':');

                if (arrayName.length === 3) {
                    arrayNameObject = arrayName[1];
                    triggeredAction = hasVisibilityChanged(args[arrayNameObject]) ? 'hide/show': '';
                    objectToCheck = args[arrayNameObject];
                }
            }

            return triggeredAction;
        };

        hasVisibilityChanged = function(objectWrapper) {
            var state,
                previousState;

            if (!_underscore.isUndefined(objectWrapper) &&
                !_underscore.isUndefined(objectWrapper).dataStore
            ) {
                previousState = !_underscore.isUndefined(objectWrapper.dataStore.previousState) ?
                    objectWrapper.dataStore.previousState.display : '';
                state = !_underscore.isUndefined(objectWrapper.dataStore.state) ?
                    objectWrapper.dataStore.state.display : '';

                if (previousState !== state && previousState !== '' && state !== '') return true;
            }

            return false;
        };

        return target;
    };
});
