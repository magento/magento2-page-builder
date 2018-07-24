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

        if ($element.attr('data-element') && $element.attr('data-element') === 'wrapper') {
            $element = $(element).find('>[data-element="main"]');
        }

        if ($element.data('enableParallax') !== 1) {
            return;
        }

        $element.addClass('jarallax');
        $element.attr('data-jarallax', '');

        window.jarallax(element, {
            imgPosition: element.style.backgroundPosition || '50% 50%',
            imgRepeat: element.style.backgroundRepeat || 'no-repeat',
            imgSize: element.style.backgroundSize || 'cover',
            speed: parseFloat($element.data('parallaxSpeed')) || 0.5
        });
    };
});
