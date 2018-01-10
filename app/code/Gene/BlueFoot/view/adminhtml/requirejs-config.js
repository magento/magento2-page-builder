/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

var config = {
    paths: {
        'bluefoot/async': 'Gene_BlueFoot/js/resource/requirejs/async',

        /* Extra Resources Needed */
        'bluefoot/html2canvas': 'Gene_BlueFoot/js/resource/html2canvas',
        'bluefoot/highlight': 'Gene_BlueFoot/js/resource/highlight/highlight.pack',
        'hyperscript': 'Gene_BlueFoot/js/resource/hyperscript/hyperscript',
        'slick': 'Gene_BlueFoot/js/resource/slick/slick',
        'xyperscript': 'Gene_BlueFoot/js/resource/xyperscript/xyperscript',

        /* Include our Knockout Sortable wrapper */
        'ko-sortable': 'Gene_BlueFoot/js/resource/sortable/knockout-sortable',
        'ko-draggable': 'Gene_BlueFoot/js/resource/draggable/knockout-draggable',
        'ko-resizable': 'Gene_BlueFoot/js/resource/resizable/knockout-resizable',
        'bluefoot/ko-dropzone': 'Gene_BlueFoot/js/resource/dropzone/knockout-dropzone',
        'bluefoot/ko-redactor': 'Gene_BlueFoot/js/resource/redactor/knockout-redactor',
        'bluefoot/ko-liveedit': 'Gene_BlueFoot/js/resource/live-edit/knockout-liveedit'
    },
    map: {
        '*': {
            /* Map the abstract widget to the input type widget */
            'bluefoot/widget/abstract': 'bluefoot/field/abstract',

            /* Utilities */
            'bluefoot/utils': 'Gene_BlueFoot/js/utils',
            'bluefoot/config': 'Gene_BlueFoot/js/component/config'
        }
    },
    shim: {
        'bluefoot/ko-sortable': {
            deps: ['jquery', 'jquery/ui', 'Gene_BlueFoot/js/resource/jquery-ui/jquery.ui.touch-punch.min']
        },
        'Gene_BlueFoot/js/resource/jquery-ui/jquery.ui.touch-punch.min': {
            deps: ['jquery/ui']
        }
    }
};
