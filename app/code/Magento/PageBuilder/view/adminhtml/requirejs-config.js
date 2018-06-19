/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

var config = {
    paths: {
        'pagebuilder/async': 'Magento_PageBuilder/js/resource/requirejs/async',

        /* Extra Resources Needed */
        'pagebuilder/html2canvas': 'Magento_PageBuilder/js/resource/html2canvas',
        'hyperscript': 'Magento_PageBuilder/js/resource/hyperscript/hyperscript',
        'xyperscript': 'Magento_PageBuilder/js/resource/xyperscript/xyperscript',
        'google-map': 'Magento_PageBuilder/js/utils/map',

        /* Include our Knockout Sortable wrapper */
        'pagebuilder/ko-dropzone': 'Magento_PageBuilder/js/resource/dropzone/knockout-dropzone',
        'pagebuilder/ko-redactor': 'Magento_PageBuilder/js/resource/redactor/knockout-redactor',
        'pagebuilder/ko-liveedit': 'Magento_PageBuilder/js/resource/live-edit/knockout-liveedit'
    },
    map: {
        '*': {
            /* Map the abstract widget to the input type widget */
            'pagebuilder/widget/abstract': 'pagebuilder/field/abstract',

            /* Utilities */
            'pagebuilder/utils': 'Magento_PageBuilder/js/utils',
            'pagebuilder/config': 'Magento_PageBuilder/js/component/config'
        }
    },
    shim: {
        'pagebuilder/ko-sortable': {
            deps: ['jquery', 'jquery/ui', 'Magento_PageBuilder/js/resource/jquery-ui/jquery.ui.touch-punch.min']
        },
        'Magento_PageBuilder/js/resource/jquery/ui/jquery.ui.touch-punch.min': {
            deps: ['jquery/ui']
        }
    },
    config: {
        mixins: {
            'Magento_Ui/js/form/element/abstract': {
                'Magento_PageBuilder/js/form/element/conditional-disable-mixin': true
            },
            'Magento_Ui/js/lib/validation/validator': {
                'Magento_PageBuilder/js/form/element/map-validator-rules-mixin': true
            },
            'mage/validation': {
                'Magento_PageBuilder/js/system/config/validator-rules-mixin': true
            }
        }
    }
};
