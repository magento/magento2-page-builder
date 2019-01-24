/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

var config = {
    map: {
        '*': {
            /* Include our Knockout Sortable wrapper */
            'pagebuilder/ko-dropzone': 'Magento_PageBuilder/js/resource/dropzone/knockout-dropzone',

            /* Utilities */
            'google-map': 'Magento_PageBuilder/js/utils/map',
            'object-path': 'Magento_PageBuilder/js/resource/object-path'
        }
    },
    shim: {
        'pagebuilder/ko-sortable': {
            deps: ['jquery', 'jquery/ui', 'Magento_PageBuilder/js/resource/jquery-ui/jquery.ui.touch-punch']
        },
        'Magento_PageBuilder/js/resource/jquery/ui/jquery.ui.touch-punch': {
            deps: ['jquery/ui']
        }
    },
    config: {
        mixins: {
            'Magento_Ui/js/form/element/abstract': {
                'Magento_PageBuilder/js/form/element/conditional-disable-mixin': true
            },
            'Magento_Ui/js/lib/validation/validator': {
                'Magento_PageBuilder/js/form/element/validator-rules-mixin': true
            },
            'mage/validation': {
                'Magento_PageBuilder/js/system/config/validator-rules-mixin': true
            }
        }
    }
};
