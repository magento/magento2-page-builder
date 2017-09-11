var config = {
    paths: {
        'bluefoot/async': 'Gene_BlueFoot/js/resource/requirejs/async',

        /* Extra Resources Needed */
        'bluefoot/html2canvas': 'Gene_BlueFoot/js/resource/html2canvas',
        'bluefoot/highlight': 'Gene_BlueFoot/js/resource/highlight/highlight.pack',
        'hyperscript': 'Gene_BlueFoot/js/resource/hyperscript/hyperscript',
        'xyperscript': 'Gene_BlueFoot/js/resource/xyperscript/xyperscript',

        /* Include our Knockout Sortable wrapper */
        'bluefoot/ko-sortable': 'Gene_BlueFoot/js/resource/sortable/knockout-sortable',
        'bluefoot/ko-draggable': 'Gene_BlueFoot/js/resource/draggable/knockout-draggable',
        'bluefoot/ko-resizable': 'Gene_BlueFoot/js/resource/resizable/knockout-resizable',
        'bluefoot/ko-dropzone': 'Gene_BlueFoot/js/resource/dropzone/knockout-dropzone',
        'bluefoot/ko-redactor': 'Gene_BlueFoot/js/resource/redactor/knockout-redactor',
        'bluefoot/ko-liveedit': 'Gene_BlueFoot/js/resource/live-edit/knockout-liveedit',

        /* Core Component Aliases */
        'bluefoot/config': 'Gene_BlueFoot/js/component/config',

        'bluefoot/hook': 'Gene_BlueFoot/js/component/hook',
        'bluefoot/event-emitter': 'Gene_BlueFoot/js/component/event-emitter',

        'bluefoot/stage': 'Gene_BlueFoot/js/component/stage',
        'bluefoot/stage/build': 'Gene_BlueFoot/js/component/stage/build',

        'bluefoot/stage/panel': 'Gene_BlueFoot/js/component/stage/panel',
        'bluefoot/stage/panel/group': 'Gene_BlueFoot/js/component/stage/panel/group',
        'bluefoot/stage/panel/group/block': 'Gene_BlueFoot/js/component/stage/panel/group/block',

        'bluefoot/stage/save': 'Gene_BlueFoot/js/component/stage/save',
        'bluefoot/stage/save/renderer': 'Gene_BlueFoot/js/component/stage/save/renderer',
        'bluefoot/stage/save/binder': 'Gene_BlueFoot/js/component/stage/save/binder',

        'bluefoot/stage/structural/editable-area': 'Gene_BlueFoot/js/component/stage/structural/editable-area',
        'bluefoot/stage/structural/abstract': 'Gene_BlueFoot/js/component/stage/structural/abstract',
        'bluefoot/stage/structural/row': 'Gene_BlueFoot/js/component/stage/structural/row',
        'bluefoot/stage/structural/column': 'Gene_BlueFoot/js/component/stage/structural/column',
        'bluefoot/stage/structural/options': 'Gene_BlueFoot/js/component/stage/structural/options',

        'bluefoot/stage/structural/options/option': 'Gene_BlueFoot/js/component/stage/structural/options/option',
        'bluefoot/stage/structural/options/column': 'Gene_BlueFoot/js/component/stage/structural/options/column',
        'bluefoot/stage/structural/column/builder': 'Gene_BlueFoot/js/component/stage/structural/column/builder',

        'bluefoot/block/factory': 'Gene_BlueFoot/js/component/block/factory',
        'bluefoot/block/abstract': 'Gene_BlueFoot/js/component/block/abstract',
        'bluefoot/block/inline': 'Gene_BlueFoot/js/component/block/inline',
        'bluefoot/block/preview/abstract': 'Gene_BlueFoot/js/component/block/preview/abstract',

        'bluefoot/template': 'Gene_BlueFoot/js/component/template',

        'bluefoot/stage/edit': 'Gene_BlueFoot/js/component/stage/edit'
    },
    map: {
        '*': {
            /* Map the abstract widget to the input type widget */
            'bluefoot/widget/abstract': 'bluefoot/field/abstract',

            /* Utilities */
            'bluefoot/utils': 'Gene_BlueFoot/js/utils'
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