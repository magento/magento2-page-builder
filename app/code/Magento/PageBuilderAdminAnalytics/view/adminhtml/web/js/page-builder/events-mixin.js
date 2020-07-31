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
            visibilityHasChanged;

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

            console.log("antes", name);
            action = getAction(name, args);

            if (!_underscore.isUndefined(args) && !_underscore.isUndefined(args.contentType) &&
                !_underscore.isUndefined(args.contentType.config && action !== '')
            ) {
                console.log('justo antes de event');
                event = {
                    element: args.contentType.config.label,
                    type: args.contentType.config.name,
                    action: action,
                    widget: {
                        name: args.contentType.config.form,
                        type: args.contentType.config.menu_section
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
                    triggeredAction = visibilityHasChanged(args[arrayNameObject]) ? 'hide/show': '';
                }
            }

            return triggeredAction;
        };

        visibilityHasChanged = function(objectWrapper) {
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
