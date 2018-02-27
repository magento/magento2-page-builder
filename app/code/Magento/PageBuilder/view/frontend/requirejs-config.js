/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

var config = {
    paths: {
        'slick': 'Magento_PageBuilder/js/resource/jquery/slick/slick',
        'highlight': 'Magento_PageBuilder/js/resource/highlight/highlight.pack',
        'bg-parallax': 'Magento_PageBuilder/js/resource/bg-parallax/bg-parallax.min',
        'jarallax': 'Magento_PageBuilder/js/resource/jarallax/jarallax'
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
