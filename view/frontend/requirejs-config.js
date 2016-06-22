var config = {
    paths: {
        'slick': 'Gene_BlueFoot/js/resource/jquery/slick/slick',
        'fancybox': 'Gene_BlueFoot/js/resource/jquery/fancybox/jquery.fancybox.pack',
        'highlight': 'Gene_BlueFoot/js/resource/highlight/highlight.pack',
        'bluefoot/tabs': 'Gene_BlueFoot/js/resource/jquery/bluefoot-tabs/jquery.bluefoot.tabs.min',
        'bluefoot/accordion': 'Gene_BlueFoot/js/resource/jquery/bluefoot-accordion/jquery.bluefoot.accordion.min',
        'bluefoot/normalise-heights': 'Gene_BlueFoot/js/resource/jquery/bluefoot-normalise-heights/jquery.bluefoot.normaliseHeights.min'
    },
    shim: {
        'slick': {
            deps: ['jquery']
        },
        'fancybox': {
            deps: ['jquery']
        },
        'bluefoot/tabs': {
            deps: ['jquery']
        },
        'bluefoot/accordion': {
            deps: ['jquery']
        },
        'bluefoot/normalise-heights': {
            deps: ['jquery']
        },
        'highlight': {
            deps: []
        }
    }
};