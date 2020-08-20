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

            if (!_.isUndefined(args.contentType)) {
                eventAttributes = args.contentType.config;
            } else if (!_.isUndefined(args.originalContentType)) {
                eventAttributes = args.originalContentType.config;
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
