/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'underscore',
    'matchMedia',
    'Magento_PageBuilder/js/utils/breakpoints',
    'slick'
], function ($, _, mediaCheck, breakpointsUtils) {
    'use strict';

    /**
     * Initialize slider.
     *
     * @param {jQuery} $carouselElement
     * @param {Object} config
     */
    function buildSlick($carouselElement, config) {
        /**
         * Prevent each slick slider from being initialized more than once which could throw an error.
         */
        if ($carouselElement.hasClass('slick-initialized')) {
            $carouselElement.slick('unslick');
        }

        config.slidesToScroll = config.slideAll ? config.slidesToShow : 1;
        $carouselElement.slick(config);
    }

    return function (config, element) {
        var $element = $(element),
            $carouselElement = $($element.children()),
            slickConfig = {
                slideAll: $element.data('slide-all'),
                autoplay: $element.data('autoplay'),
                autoplaySpeed: $element.data('autoplay-speed') || 0,
                arrows: $element.data('show-arrows'),
                dots: $element.data('show-dots'),
                centerMode: $element.data('center-mode')
            };

        if (slickConfig.centerMode) {
            slickConfig.centerPadding = $element.data('center-padding');
        } else {
            slickConfig.infinite = $element.data('infinite-loop');
        }

        _.each(config.breakpoints, function (breakpoint) {
            mediaCheck({
                media: breakpointsUtils.buildMedia(breakpoint.conditions),

                /** @inheritdoc */
                entry: function () {
                    slickConfig.slidesToShow = parseFloat(breakpoint.options.products.slidesToShow);
                    buildSlick($carouselElement, slickConfig);
                }
            });
        });
    };
});
