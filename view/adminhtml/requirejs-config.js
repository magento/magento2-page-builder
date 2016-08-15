var config = {
    paths: {
        'bluefoot/async': 'Gene_BlueFoot/js/resource/requirejs/async',

        /* Extra Resources Needed */
        'bluefoot/mustache': 'Gene_BlueFoot/js/resource/mustache.min',
        'bluefoot/html2canvas': 'Gene_BlueFoot/js/resource/html2canvas',
        'bluefoot/highlight': 'Gene_BlueFoot/js/resource/highlight/highlight.pack',

        /* Include our Knockout Sortable wrapper */
        'bluefoot/ko-sortable': 'Gene_BlueFoot/js/resource/sortable/knockout-sortable',

        /* Core Component Aliases */
        'bluefoot/common': 'Gene_BlueFoot/js/component/core/common',
        'bluefoot/ajax': 'Gene_BlueFoot/js/component/core/ajax',
        'bluefoot/dragdrop': 'Gene_BlueFoot/js/component/core/dragdrop',
        'bluefoot/config': 'Gene_BlueFoot/js/component/core/config',
        'bluefoot/renderer': 'Gene_BlueFoot/js/component/core/renderer',
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

        'bluefoot/structural': 'Gene_BlueFoot/js/component/core/structural',
        'bluefoot/template': 'Gene_BlueFoot/js/component/core/template',

        /* Edit Panel */
        'bluefoot/edit': 'Gene_BlueFoot/js/component/core/edit',
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
            /* Alias the BlueFoot jquery instances through to Magento 2's */
            'bluefoot/jquery': 'jquery',
            'bluefoot/jquery/ui': 'jquery/ui',

            /* Map the abstract widget to the input type widget */
            'bluefoot/widget/abstract': 'bluefoot/field/abstract',
        }
    },
    shim: {
        'bluefoot/ko-sortable': {
            deps: ['jquery', 'jquery/ui']
        }
    }
};