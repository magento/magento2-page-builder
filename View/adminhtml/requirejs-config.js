var config = {
    paths: {
        'bluefoot/async': 'Gene_BlueFoot/js/resource/requirejs/async',

        /* Extra Resources Needed */
        'bluefoot/mustache': 'Gene_BlueFoot/js/resource/mustache.min',
        'bluefoot/html2canvas': 'Gene_BlueFoot/js/resource/html2canvas',
        'bluefoot/highlight': 'Gene_BlueFoot/js/resource/highlight/highlight.pack',

        /* Core Component Aliases */
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
        'bluefoot/stage/save': 'Gene_BlueFoot/js/component/core/stage/save',
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
        'bluefoot/content-type/abstract': 'Gene_BlueFoot/js/content-type/core/abstract',

        'jquery/tag-it': 'Gene_BlueFoot/js/resource/jquery/tag-it/tag-it.min',
        'jquery/ui-touch-punch': 'Gene_BlueFoot/js/resource/jquery-ui/jquery.ui.touch-punch.min',
        'jquery/bluefoot-accordion': 'Gene_BlueFoot/js/resource/jquery/bluefoot-accordion/jquery.bluefoot.accordion.min',
        'jquery/bluefoot-tabs': 'Gene_BlueFoot/js/resource/jquery/bluefoot-tabs/jquery.bluefoot.tabs.min',
        'jquery/bluefoot-normalise-heights': 'Gene_BlueFoot/js/resource/jquery/bluefoot-normalise-heights/jquery.bluefoot.normaliseHeights.min',
        'jquery/slick': 'Gene_BlueFoot/js/resource/jquery/slick/slick.min'
    },
    shim: {
        'jquery/tag-it': {
            deps: ['jquery', 'bluefoot/jquery/ui']
        },
        'jquery/ui-touch-punch': {
            deps: ['jquery', 'bluefoot/jquery/ui']
        },
        'jquery/bluefoot-accordion': {
            deps: ['jquery']
        },
        'jquery/bluefoot-tabs': {
            deps: ['jquery']
        },
        'jquery/bluefoot-normalise-heights': {
            deps: ['jquery']
        },
        'jquery/slick': {
            deps: ['jquery']
        }
    },
    map: {
        '*': {
            /* Alias the BlueFoot jquery instances through to Magento 2's */
            'bluefoot/jquery': 'jquery',
            'bluefoot/jquery/ui': 'jquery/ui',

            /* Map the abstract widget to the input type widget */
            'bluefoot/widget/abstract': 'bluefoot/field/abstract'
        }
    }
};