/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'jarallax'
], function ($) {
    'use strict';

    return function (config, element) {
        var $element = $(element),
            parallaxSpeed = null;

        if ($element.data('appearance') === 'contained') {
            $element = $(element).find('[data-element="inner"]');
        }

        if ($('[data-content-type="row"]').index(element) === 0 && $element.data('full-min-height')) {
            $element[0].style.minHeight = 'calc(100vh - ' + element[0].offsetTop + 'px)';
        }

        if ($element.data('enableParallax') !== 1) {
            return;
        }

        $element.addClass('jarallax');
        $element.attr('data-jarallax', '');

        parallaxSpeed = parseFloat($element.data('parallaxSpeed'));

        window.jarallax($element[0], {
            imgPosition: $element[0].style.backgroundPosition || '50% 50%',
            imgRepeat: $element[0].style.backgroundRepeat || 'no-repeat',
            imgSize: $element[0].style.backgroundSize || 'cover',
            speed: !isNaN(parallaxSpeed) ? parallaxSpeed : 0.5
        });
    };
});
