var config = {
    paths: {
        'bluefoot/async': 'Gene_BlueFoot/js/resource/requirejs/async',

        /* Extra Resources Needed */
        'bluefoot/html2canvas': 'Gene_BlueFoot/js/resource/html2canvas',
        'bluefoot/highlight': 'Gene_BlueFoot/js/resource/highlight/highlight.pack',

        /* Include our Knockout Sortable wrapper */
        'bluefoot/ko-sortable': 'Gene_BlueFoot/js/resource/sortable/knockout-sortable',
        'bluefoot/ko-resizable': 'Gene_BlueFoot/js/resource/resizable/knockout-resizable',
        'bluefoot/ko-dropzone': 'Gene_BlueFoot/js/resource/dropzone/knockout-dropzone',
        'bluefoot/ko-redactor': 'Gene_BlueFoot/js/resource/redactor/knockout-redactor',
        'bluefoot/ko-liveedit': 'Gene_BlueFoot/js/resource/live-edit/knockout-liveedit',

        /* Core Component Aliases */
        'bluefoot/common': 'Gene_BlueFoot/js/component/core/common',
        'bluefoot/ajax': 'Gene_BlueFoot/js/component/core/ajax',
        'bluefoot/config': 'Gene_BlueFoot/js/component/core/config',

        'bluefoot/hook': 'Gene_BlueFoot/js/component/core/hook',

        'bluefoot/modal': 'Gene_BlueFoot/js/component/core/modal',

        'bluefoot/plugins': 'Gene_BlueFoot/js/component/core/plugins',

        'bluefoot/stage': 'Gene_BlueFoot/js/component/core/stage',
        'bluefoot/stage/build': 'Gene_BlueFoot/js/component/core/stage/build',

        'bluefoot/stage/panel': 'Gene_BlueFoot/js/component/core/stage/panel',
        'bluefoot/stage/panel/group': 'Gene_BlueFoot/js/component/core/stage/panel/group',
        'bluefoot/stage/panel/group/block': 'Gene_BlueFoot/js/component/core/stage/panel/group/block',

        'bluefoot/stage/save': 'Gene_BlueFoot/js/component/core/stage/save',

        'bluefoot/stage/structural/abstract': 'Gene_BlueFoot/js/component/core/stage/structural/abstract',
        'bluefoot/stage/structural/row': 'Gene_BlueFoot/js/component/core/stage/structural/row',
        'bluefoot/stage/structural/column': 'Gene_BlueFoot/js/component/core/stage/structural/column',
        'bluefoot/stage/structural/options': 'Gene_BlueFoot/js/component/core/stage/structural/options',

        'bluefoot/stage/structural/options/option': 'Gene_BlueFoot/js/component/core/stage/structural/options/option',
        'bluefoot/stage/structural/options/column': 'Gene_BlueFoot/js/component/core/stage/structural/options/column',
        'bluefoot/stage/structural/column/builder': 'Gene_BlueFoot/js/component/core/stage/structural/column/builder',

        'bluefoot/block/abstract': 'Gene_BlueFoot/js/component/core/block/abstract',
        'bluefoot/block/inline': 'Gene_BlueFoot/js/component/core/block/inline',
        'bluefoot/block/preview/abstract': 'Gene_BlueFoot/js/component/core/block/preview/abstract',

        'bluefoot/template': 'Gene_BlueFoot/js/component/core/template',

        'bluefoot/stage/edit': 'Gene_BlueFoot/js/component/core/stage/edit',

        'bluefoot/field/text': 'Gene_BlueFoot/js/component/core/edit/fields/text',
        'bluefoot/field/select': 'Gene_BlueFoot/js/component/core/edit/fields/select',
        'bluefoot/field/textarea': 'Gene_BlueFoot/js/component/core/edit/fields/textarea',
        'bluefoot/field/date': 'Gene_BlueFoot/js/component/core/edit/fields/date',
        'bluefoot/field/abstract': 'Gene_BlueFoot/js/component/core/edit/fields/abstract',

        /* Content Types */
        'bluefoot/content-type/abstract': 'Gene_BlueFoot/js/content-type/core/abstract'
    },
    map: {
        '*': {
            /* Map the abstract widget to the input type widget */
            'bluefoot/widget/abstract': 'bluefoot/field/abstract',
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