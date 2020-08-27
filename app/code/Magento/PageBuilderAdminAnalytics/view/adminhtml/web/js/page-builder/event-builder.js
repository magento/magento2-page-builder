/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['underscore'], function (_) {
    'use strict';

    return {

        /**
         * Sets up event attributes and action depending on name and args
         *
         * @param {String} name
         * @param {Array} args
         */

        build: function (name, args) {
            var action = '',
                eventAttributes = {},
                event;

            if (_.isUndefined(args)) {
                return;
            }

            switch (name) {
                case 'contentType:duplicateAfter':
                    action = 'duplicate';
                    break;

                case 'contentType:removeAfter':
                    action = 'remove';
                    break;

                case 'contentType:createAfter':
                    action = 'create';
                    break;

                case 'contentType:editBefore':
                    action = 'edit';
                    break;

                case 'contentType:visibilityAfter':
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
