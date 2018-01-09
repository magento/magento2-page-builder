/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/*eslint-disable */
var config = {
    paths: {
        'slick': 'Gene_BlueFoot/js/resource/jquery/slick/slick',
        'fancybox': 'Gene_BlueFoot/js/resource/jquery/fancybox/jquery.fancybox.pack',
        'highlight': 'Gene_BlueFoot/js/resource/highlight/highlight.pack',
        'bg-parallax': 'Gene_BlueFoot/js/resource/bg-parallax/bg-parallax.min'
    },
    shim: {
        'slick': {
            deps: ['jquery']
        },
        'fancybox': {
            deps: ['jquery']
        },
        'highlight': {
            deps: []
        }
    }
};