/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*global requirejs */

requirejs(['jquery', 'fancybox', 'highlight', 'slick', 'bg-parallax'], function ($, fancybox, hljs) {
    $(document).ready(function() {
        $('.pagebuilder-lightbox').fancybox();

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


        $('div[data-role="banner"][data-show-button="on_hover"] > a').each(function (index, element) {
            var overlayEl = $(element).find('.pagebuilder-banner-button');
            $(element).hover(
                function() {
                    overlayEl.css({
                        'opacity' : '1',
                        'visibility' : 'visible'
                    });
                }, function() {
                    overlayEl.css({
                        'opacity' : '0',
                        'visibility' : 'hidden'
                    });
                }
            );
        });

        $('div[data-role="banner"][data-show-overlay="on_hover"] > a').each(function (index, element) {
            var overlayEl = $(element).find('.pagebuilder-poster-overlay'),
                overlayColor = overlayEl.attr('data-background-color');
            $(element).hover(
                function() {
                    overlayEl.css('background-color', overlayColor);
                }, function() {
                    overlayEl.css('background-color', 'transparent');
                }
            );
        });
    });

    $(window).load(function (){
        window.bgParallax('.pagebuilder-parallax');
    });
});
