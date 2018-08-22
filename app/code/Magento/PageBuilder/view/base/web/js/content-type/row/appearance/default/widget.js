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
        var $element = $(element);

        if ($element.data('appearance') === 'contained') {
            $element = $(element).find('[data-element="inner"]');
        }

        if ($element.data('enableParallax') !== 1) {
            return;
        }

        $element.addClass('jarallax');
        $element.attr('data-jarallax', '');

        window.jarallax($element[0], {
            imgPosition: $element[0].style.backgroundPosition || '50% 50%',
            imgRepeat: $element[0].style.backgroundRepeat || 'no-repeat',
            imgSize: $element[0].style.backgroundSize || 'cover',
            speed: parseFloat($element.data('parallaxSpeed')) || 0.5
        });
    };
});
