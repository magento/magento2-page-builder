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
define(['underscore'], function (_, name, args) {
    'use strict';
    return {
        build: function (name, args) {
            var arrayName = name.split(':'),
                arrayNameObject,
                action = '',
                eventAttributes = {};

            if (_.isUndefined(args)) {
                return;
            }
            // if (arrayName.length === 3) {
            //     arrayNameObject = arrayName[1];
            //     eventAttributes =
            //         !_.isUndefined(args[arrayNameObject]) &&
            //         !_.isUndefined(args[arrayNameObject].config) ?
            //             args[arrayNameObject].config : {};
            //     eventAttributes.action = action;
            //     return eventAttributes;
            // } else if (arrayName.length === 2) {
                switch (arrayName[arrayName.length - 1]) {
                    case 'duplicateAfter':
                        action = 'duplicate';
                        eventAttributes =
                            !_.isUndefined(args.originalContentType) &&
                            !_.isUndefined(args.originalContentType.config) ?
                                args.originalContentType.config : {};
                        eventAttributes.action = action;
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

                    case 'visibilityAfter':
                        action = args.visibility ? 'show' : 'hide';
                        break;

                    default:
                        break;
                }

                eventAttributes = !_.isUndefined(args.contentType) &&
                !_.isUndefined(args.contentType.config) ?
                    args.contentType.config : {};
                eventAttributes.action = action;
                return eventAttributes;
            }
        }
    //}
});
