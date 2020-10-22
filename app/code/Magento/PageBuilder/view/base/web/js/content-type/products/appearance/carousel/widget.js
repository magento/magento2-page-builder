/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'underscore',
    'matchMedia',
    'Magento_PageBuilder/js/utils/breakpoints',
    'Magento_PageBuilder/js/events',
    'Magento_PageBuilder/js/config',
    'slick'
], function ($, _, mediaCheck, breakpointsUtils, events, pageBuilderConfig) {
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

    function initSlider($element, slickConfig, breakpoint) {
        var productCount = $element.find('.product-item').length,
            $carouselElement = $($element.children()),
            centerModeClass = 'center-mode',
            carouselMode = $element.data('carousel-mode'),
            slidesToShow = breakpoint.options.products[carouselMode] ?
                breakpoint.options.products[carouselMode].slidesToShow :
                breakpoint.options.products.default.slidesToShow;

        slickConfig.slidesToShow = parseFloat(slidesToShow);

        if (carouselMode === 'continuous' && productCount > slickConfig.slidesToShow) {
            $element.addClass(centerModeClass);
            slickConfig.centerPadding = $element.data('center-padding');
            slickConfig.centerMode = true;
        } else {
            $element.removeClass(centerModeClass);
            slickConfig.infinite = $element.data('infinite-loop');
        }

        buildSlick($carouselElement, slickConfig);
    }

    return function (config, element) {
        var $element = $(element),
            $carouselElement = $($element.children()),
            stageId = $($element).parents('[data-role="pagebuilder-stage"]').attr('id'),
            currentViewport = pageBuilderConfig.getConfig("viewport"),
            slickConfig = {
                autoplay: $element.data('autoplay'),
                autoplaySpeed: $element.data('autoplay-speed') || 0,
                arrows: $element.data('show-arrows'),
                dots: $element.data('show-dots')
            };

        _.each(config.breakpoints, function (breakpoint) {
            mediaCheck({
                media: breakpointsUtils.buildMedia(breakpoint.conditions),

                /** @inheritdoc */
                entry: function () {
                    initSlider($element, slickConfig, breakpoint);
                }
            });
        });

        //initialize slider when content type is added in mobile viewport
        if (currentViewport === 'mobile') {
            var breakpoint = config.breakpoints[currentViewport];
            initSlider($element, slickConfig, breakpoint);
        }

        // Redraw slide after content type gets redrawn
        events.on('contentType:redrawAfter', function (args) {
            if ($carouselElement.closest(args.element).length) {
                $carouselElement.slick('setPosition');
            }
        });

        events.on('stage:' + stageId + ':viewportChangeAfter', function (args) {
            var breakpoint = config.breakpoints[args.viewport];
            initSlider($element, slickConfig, breakpoint);
        });
    };
});
