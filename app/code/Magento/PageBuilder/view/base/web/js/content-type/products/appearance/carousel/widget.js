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

        config.slidesToScroll = config.slidesToShow;
        $carouselElement.slick(config);
    }

    return function (config, element) {
        var $element = $(element),
            $carouselElement = $($element.children()),
            carouselMode = $element.data('carousel-mode'),
            slickConfig = {
                autoplay: $element.data('autoplay'),
                autoplaySpeed: $element.data('autoplay-speed') || 0,
                arrows: $element.data('show-arrows'),
                dots: $element.data('show-dots')
            };

        if (carouselMode === 'continuous') {
            slickConfig.centerPadding = $element.data('center-padding');
            slickConfig.centerMode = true;
        } else if ($element.data('infinite-loop')) {
            slickConfig.infinite = $element.data('infinite-loop');
        }

        _.each(config.breakpoints, function (breakpoint) {
            mediaCheck({
                media: breakpointsUtils.buildMedia(breakpoint.conditions),

                /** @inheritdoc */
                entry: function () {
                    var slidesToShow = breakpoint.options.products[carouselMode] ?
                        breakpoint.options.products[carouselMode].slidesToShow :
                        breakpoint.options.products.default.slidesToShow;

                    slickConfig.slidesToShow = parseFloat(slidesToShow);
                    buildSlick($carouselElement, slickConfig);
                }
            });
        });
    };
});
