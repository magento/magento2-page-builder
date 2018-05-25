/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

var config = {
    paths: {
        'pagebuilder/async': 'Magento_PageBuilder/js/resource/requirejs/async',

        /* Extra Resources Needed */
        'pagebuilder/html2canvas': 'Magento_PageBuilder/js/resource/html2canvas',
        'pagebuilder/highlight': 'Magento_PageBuilder/js/resource/highlight/highlight.pack',
        'hyperscript': 'Magento_PageBuilder/js/resource/hyperscript/hyperscript',
        'xyperscript': 'Magento_PageBuilder/js/resource/xyperscript/xyperscript',
        'google-map': 'Magento_PageBuilder/js/utils/map',

        /* Include our Knockout Sortable wrapper */
        'ko-sortable': 'Magento_PageBuilder/js/resource/sortable/knockout-sortable',
        'ko-draggable': 'Magento_PageBuilder/js/resource/draggable/knockout-draggable',
        'ko-resizable': 'Magento_PageBuilder/js/resource/resizable/knockout-resizable',
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
        'Magento_PageBuilder/js/resource/jquery-ui/jquery.ui.touch-punch.min': {
            deps: ['jquery/ui']
        }
    },
    config: {
        mixins: {
            'Magento_Ui/js/form/element/abstract': {
                'Magento_PageBuilder/js/form/element/conditional-disable-mixin': true
            },
            'Magento_Ui/js/form/components/button': {
                'Magento_PageBuilder/js/form/components/button-conditional-disable-mixin': true
            },
            'Magento_Ui/js/lib/validation/validator': {
                'Magento_PageBuilder/js/form/element/validator-rules-mixin': true
            }
        }
    }
};
