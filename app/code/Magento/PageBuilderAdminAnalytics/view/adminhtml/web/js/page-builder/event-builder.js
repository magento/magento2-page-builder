/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['underscore'], function (_) {
    'use strict';

    return {
        build: function (name, args) {
            var arrayName = name.split(':'),
                action = '',
                eventAttributes = {},
                event;

            if (_.isUndefined(args)) {
                return;
            }

            /**
             * Sets up event attributes and action depending on name and args
             *
             * @param {String} name
             * @param {Array} args
             */

            switch (arrayName[arrayName.length - 1]) {
                case 'duplicateAfter':
                    action = 'duplicate';
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

                case 'visibilityAfter':
                    action = args.visibility ? 'show' : 'hide';
                    break;

                default:
                    break;
            }

            if (action === 'duplicate' || action === 'hide' || action === 'show') {
                eventAttributes =
                    !_.isUndefined(args.originalContentType) &&
                    !_.isUndefined(args.originalContentType.config) ?
                        args.originalContentType.config : {};
            } else {
                eventAttributes = !_.isUndefined(args.contentType) &&
                !_.isUndefined(args.contentType.config) ?
                    args.contentType.config : {};
            }

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
            }

            return event;
        }
    };
});
