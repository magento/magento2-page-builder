/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'jarallax',
    'jarallaxVideo',
    'vimeoWrapper'
], function ($) {
    'use strict';

    return function (config, element) {
        var $element = $(element),
            parallaxSpeed = $element.data('enableParallax') !== 1 ? 1 : parseFloat($element.data('parallaxSpeed'));

        if ($element.data('background-type') !== 'video') {
            return;
        }

        $element.addClass('jarallax');
        $element.attr('data-jarallax', '');

        window.jarallax($element[0], {
            imgSrc: $element.data('videoFallbackSrc'),
            speed: !isNaN(parallaxSpeed) ? parallaxSpeed : 0.5,
            videoLoop: $element.data('videoLoop'),
            videoPlayOnlyVisible: $element.data('videoPlayOnlyVisible'),
            videoLazyLoading: $element.data('videoLazyLoad'),
            disableVideo: false,
            elementInViewport: $element.data('elementInViewport') &&
                $element[0].querySelector($element.data('elementInViewport'))
        });
        $element[0].jarallax.video && $element[0].jarallax.video.on('started', function () {
            if ($element[0].jarallax.$video) {
                $element[0].jarallax.$video.style.visibility = 'visible';
            }
        });
    };
});
