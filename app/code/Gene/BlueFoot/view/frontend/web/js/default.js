/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['jquery', 'fancybox', 'highlight', 'slick', 'bg-parallax'], function ($, fancybox, hljs) {
    'use strict';
    $(document).ready(function() {
        $('.bluefoot-lightbox').fancybox();

        $('pre code:not(.hljs)').each(function (i, block) {
            $(block).html(
                hljs.highlight('html', $(block).html()).value
            );
        });

        $('div[data-role="advanced-slider"]').each(function (index, element) {
            if ($(element) && $(element).length > 0) {
                /**
                 * Prevent each slick slider from being initialized more than once which could throw an error.
                 */
                if($(element).hasClass('slick-initialized')) {
                    $(element).slick('unslick');
                }

                $(element).slick({
                    autoplay: $(element).data('autoplay') === 1,
                    autoplaySpeed: $(element).data('autoplay-speed') || 0,
                    fade: $(element).data('fade') === 1,
                    infinite: $(element).data('is-infinite') === 1,
                    arrows: $(element).data('show-arrows') === 1,
                    dots: $(element).data('show-dots') === 1
                });
            }
        });

        $('div[data-role="row"][data-enable-parallax="1"]').each(function (index, element) {
            $(element).addClass('pagebuilder-parallax');
        });
    });

    $(window).load(function (){
        window.bgParallax('.pagebuilder-parallax');
    });
});
