/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'vimeo',
    'jarallax',
    'jarallaxVideo'
], function ($, Player) {
    'use strict';

    return function (config, element) {
        var $element = $(element),
            parallaxSpeed = null,
            jarallaxConfig = null;

        if ($element.data('appearance') === 'contained') {
            $element = $(element).find('[data-element="inner"]');
        }

        if ($element.data('enableParallax') !== 1 && $element.data('background-type') !== 'video') {
            return;
        }

        $element.addClass('jarallax');
        $element.attr('data-jarallax', '');
        parallaxSpeed = parallaxSpeed || parseFloat($element.data('parallaxSpeed'));

        if ($element.data('background-type') === 'video') {
            window.Vimeo = window.Vimeo || {
                'Player': Player
            };

            parallaxSpeed = $element.data('enableParallax') !== 1 ? 1 : parallaxSpeed;

            jarallaxConfig = {
                speed: !isNaN(parallaxSpeed) ? parallaxSpeed : 0.5,
                videoLoop: $element.data('videoLoop'),
                videoPlayOnlyVisible: $element.data('videoPlayOnlyVisible'),
                disableVideo: false
            }
        }

        jarallaxConfig = jarallaxConfig || {
            imgPosition: $element[0].style.backgroundPosition || '50% 50%',
            imgRepeat: $element[0].style.backgroundRepeat || 'no-repeat',
            imgSize: $element[0].style.backgroundSize || 'cover',
            speed: !isNaN(parallaxSpeed) ? parallaxSpeed : 0.5
        };

        window.jarallax($element[0], jarallaxConfig);
    };
});
