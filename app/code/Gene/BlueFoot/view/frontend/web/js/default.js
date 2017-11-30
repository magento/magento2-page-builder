/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

requirejs(['jquery', 'fancybox', 'highlight', 'slick'], function ($, fancybox, hljs) {
    $(document).ready(function() {
        $('.bluefoot-lightbox').fancybox();

        $('pre code:not(.hljs)').each(function(i, block) {
            $(block).html(
                hljs.highlight('html', $(block).html()).value
            );
        });

        $("div[data-role='advanced-slider']").slick();



    });
});
