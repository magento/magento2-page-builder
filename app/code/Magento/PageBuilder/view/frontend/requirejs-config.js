/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

var config = {
    paths: {
        'slick': 'Magento_PageBuilder/js/resource/jquery/slick/slick',
        'highlight': 'Magento_PageBuilder/js/resource/highlight/highlight.pack',
        'jarallax': 'Magento_PageBuilder/js/resource/jarallax/jarallax.min'
    },
    shim: {
        'slick': {
            deps: ['jquery']
        },
        'highlight': {
            deps: []
        }
    }
};
