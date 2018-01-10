/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*eslint-disable */

var config = {
    paths: {
        'slick': 'Magento_PageBuilder/js/resource/jquery/slick/slick',
        'fancybox': 'Magento_PageBuilder/js/resource/jquery/fancybox/jquery.fancybox.pack',
        'highlight': 'Magento_PageBuilder/js/resource/highlight/highlight.pack',
        'bg-parallax': 'Magento_PageBuilder/js/resource/bg-parallax/bg-parallax.min'
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