/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*global requirejs */

requirejs(['jquery', 'highlight', 'slick', 'jarallax'], function ($, hljs) {
    'use strict';
    $(document).ready(function() {
        $('pre code:not(.hljs)').each(function (i, block) {
            $(block).html(
                hljs.highlight('html', $(block).html()).value
            );
        });

        $('div[data-role="slider"]').each(function (index, element) {
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
            $(element).addClass('jarallax');
            $(element).attr('data-jarallax','');

            window.jarallax(element, {
                imgPosition: element.style.backgroundPosition || '50% 50%',
                imgRepeat: element.style.backgroundRepeat || 'no-repeat',
                imgSize: element.style.backgroundSize || 'cover',
                speed: parseFloat($(element).data('speed')) || 0.5
            });
        });

        /*eslint-disable max-nested-callbacks */
        $('div[data-role="banner"][data-show-button="on_hover"] > a').each(function (index, element) {
            var buttonEl = $(element).find('.pagebuilder-banner-button');

            $(element).hover(
                function() {
                    buttonEl.css({
                        'opacity' : '1',
                        'visibility' : 'visible'
                    });
                }, function() {
                    buttonEl.css({
                        'opacity' : '0',
                        'visibility' : 'hidden'
                    });
                }
            );
        });

        $('div[data-role="banner"][data-show-overlay="on_hover"] > a').each(function (index, element) {
            var overlayEl = $(element).find('.pagebuilder-overlay'),
                overlayColor = overlayEl.attr('data-overlay-color');

            $(element).hover(
                function() {
                    overlayEl.css('background-color', overlayColor);
                }, function() {
                    overlayEl.css('background-color', 'transparent');
                }
            );
        });

        $('div[data-role="slide"][data-show-button="on_hover"] > a').each(function (index, element) {
            var buttonEl = $(element).find('.pagebuilder-slide-button');

            $(element).hover(
                function() {
                    buttonEl.css({
                        'opacity' : '1',
                        'visibility' : 'visible'
                    });
                }, function() {
                    buttonEl.css({
                        'opacity' : '0',
                        'visibility' : 'hidden'
                    });
                }
            );
        });

        $('div[data-role="slide"][data-show-overlay="on_hover"] > a').each(function (index, element) {
            var overlayEl = $(element).find('.pagebuilder-overlay'),
                overlayColor = overlayEl.attr('data-overlay-color');

            $(element).hover(
                function() {
                    overlayEl.css('background-color', overlayColor);
                }, function() {
                    overlayEl.css('background-color', 'transparent');
                }
            );
        });
        /*eslint-enable max-nested-callbacks */
    });
});
