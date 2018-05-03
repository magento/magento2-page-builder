/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

var config = {
    paths: {
        /* Extra Resources Needed */
        'pagebuilder/highlight': 'Magento_PageBuilder/js/resource/highlight/highlight.pack',
        'google-map': 'Magento_PageBuilder/js/utils/map',

        /* Include our Knockout Sortable wrapper */
        'ko-pagebuilder-sortable': 'Magento_PageBuilder/js/binding/ko-pagebuilder-sortable',
        'ko-pagebuilder-draggable': 'Magento_PageBuilder/js/binding/ko-pagebuilder-draggable',
        'ko-pagebuilder-live-edit': 'Magento_PageBuilder/js/binding/ko-pagebuilder-live-edit'
    },
    config: {
        mixins: {
            'Magento_Ui/js/form/element/abstract': {
                'Magento_PageBuilder/js/form/element/conditional-disable-mixin': true
            }
        }
    }
};
