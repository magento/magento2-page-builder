/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'Magento_PageBuilder/js/widget/video-background',
    'jarallax'
], function ($, videoBackground) {
    'use strict';

    return function (config, element) {
        var $element = $(element),
            parallaxSpeed = null,
            elementStyle = null;

        if ($element.data('appearance') === 'contained') {
            $element = $(element).find('[data-element="inner"]');
        }

        if ($element.data('background-type') === 'video') {
            videoBackground(config, $element[0]);

            return;
        }

        if ($element.data('enableParallax') !== 1) {
            return;
        }

        $element.addClass('jarallax');
        $element.attr('data-jarallax', '');

        parallaxSpeed = parseFloat($element.data('parallaxSpeed'));
        elementStyle = window.getComputedStyle($element[0]);

        window.jarallax($element[0], {
            imgPosition: elementStyle.backgroundPosition || '50% 50%',
            imgRepeat: elementStyle.backgroundRepeat || 'no-repeat',
            imgSize: elementStyle.backgroundSize || 'cover',
            speed: !isNaN(parallaxSpeed) ? parallaxSpeed : 0.5
        });
    };
});
