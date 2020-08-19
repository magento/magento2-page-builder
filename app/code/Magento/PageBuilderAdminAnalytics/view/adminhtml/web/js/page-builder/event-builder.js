/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Sets up event attributes depending on name and args
 *
 * @param {String} name
 * @param {Array} args
 */
define(['underscore'],
    function (_, name, args) {
        'use strict';
        var EventBuilder = {};
        EventBuilder.build = function(name,args)
        {
            var arrayName = name.split(':'),
                arrayNameObject,
                action = '',
                eventAttributes = {},
                hasVisibilityChanged;

            if (_.isUndefined(args)) {
                return;
            }
            if (arrayName.length === 3) {
                arrayNameObject = arrayName[1];
                //action = hasVisibilityChanged(args[arrayNameObject]) ? 'hide/show' : '';
                eventAttributes =
                    !_.isUndefined(args[arrayNameObject]) &&
                    !_.isUndefined(args[arrayNameObject].config) ?
                        args[arrayNameObject].config : {};
                return eventAttributes;
            } else if (arrayName.length === 2) {
                switch (arrayName[arrayName.length - 1]) {
                    case 'duplicateAfter':
                        action = 'duplicate';
                        eventAttributes =
                            !_.isUndefined(args.originalContentType) &&
                            !_.isUndefined(args.originalContentType.config) ?
                                args.originalContentType.config : {};
                        return eventAttributes;

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

                eventAttributes = !_.isUndefined(args.contentType) &&
                       !_.isUndefined(args.contentType.config) ?
                       args.contentType.config : {};
                return eventAttributes;
            }
        }
        return EventBuilder;
    });


/**
 * Returns true when visibility has changed from previousState to state
 *
 * @param {Object} objectWrapper
 */
/*hasVisibilityChanged = function (objectWrapper) {
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
};*/
