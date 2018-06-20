/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*global requirejs */

requirejs([
    'jquery',
    'Magento_PageBuilder/js/utils/map',
    'jquery/ui',
    'slick',
    'jarallax'
], function ($, GoogleMap) {
    'use strict';

    /**
     * Show the overlay on hover of specific elements
     *
     * @param {JQuery<Element>[]} $elements
     */
    function showOverlayOnHover($elements) {
        $elements.each(function (index, element) {
            var overlayEl = $(element).find('.pagebuilder-overlay'),
                overlayColor = overlayEl.attr('data-overlay-color');

            $(element).hover(
                function () {
                    overlayEl.css('background-color', overlayColor);
                },
                function () {
                    overlayEl.css('background-color', 'transparent');
                }
            );
        });
    }

    /**
     * Show button on hover of specific elements
     *
     * @param {JQuery<Element>[]} $elements
     * @param {String} buttonClass
     */
    function showButtonOnHover($elements, buttonClass) {
        $elements.each(function (index, element) {
            var buttonEl = $(element).find(buttonClass);

            if (buttonEl) {
                $(element).hover(
                    function () {
                        buttonEl.css({
                            'opacity': '1',
                            'visibility': 'visible'
                        });
                    }, function () {
                        buttonEl.css({
                            'opacity': '0',
                            'visibility': 'hidden'
                        });
                    }
                );
            }
        });
    }

    $(document).ready(function () {

        $('div[data-role="slider"]').each(function (index, element) {
            if ($(element) && $(element).length > 0) {
                /**
                 * Prevent each slick slider from being initialized more than once which could throw an error.
                 */
                if ($(element).hasClass('slick-initialized')) {
                    $(element).slick('unslick');
                }

                $(element).slick({
                    autoplay: $(element).data('autoplay'),
                    autoplaySpeed: $(element).data('autoplay-speed') || 0,
                    fade: $(element).data('fade'),
                    infinite: $(element).data('is-infinite'),
                    arrows: $(element).data('show-arrows'),
                    dots: $(element).data('show-dots')
                });
            }
        });

        $('div[data-role="row"][data-enable-parallax="1"]').each(function (index, element) {
            $(element).addClass('jarallax');
            $(element).attr('data-jarallax', '');

            window.jarallax(element, {
                imgPosition: element.style.backgroundPosition || '50% 50%',
                imgRepeat: element.style.backgroundRepeat || 'no-repeat',
                imgSize: element.style.backgroundSize || 'cover',
                speed: parseFloat($(element).data('speed')) || 0.5
            });
        });

        showOverlayOnHover($('div[data-role="banner"][data-show-overlay="on_hover"] > a'));
        showButtonOnHover($('div[data-role="banner"][data-show-button="on_hover"] > a'), '.pagebuilder-banner-button');

        showOverlayOnHover($('div[data-role="slide"][data-show-overlay="hover"] > a'));
        showButtonOnHover($('div[data-role="slide"][data-show-button="hover"] > a'), '.pagebuilder-slide-button');

        $('div[data-role="tabs"]').each(function (index, element) {
            $.ui.tabs(
                {
                    active: $(element).data('active-tab') || 0,
                    create:

                        /**
                         * Adjust the margin bottom of the navigation to correctly display the active tab
                         */
                        function () {
                            var borderWidth = parseInt($(this).find('.tabs-content').css('borderWidth').toString(), 10);

                            $(this).find('.tabs-navigation').css('marginBottom', -borderWidth);
                            $(this).find('.tabs-navigation li:not(:first-child)').css('marginLeft', -borderWidth);
                        }
                },
                $(element)
            );
        });
    });

    /* Google Maps */
    $('div[data-role="map"]').each(function (index, element) {
        var locations,
            controls,
            mapOptions = {};

        /**
         * Sets height to 300px as default if no height input. But will not be saved to database
         */
        if ($(element).context.style.height === '') {
            $(element).height('300px');
        }

        if (element.hasAttribute('data-locations') && element.getAttribute('data-locations') !== '[]') {
            locations = JSON.parse(element.getAttribute('data-locations'));
            locations.forEach(function (location) {
                location.position.latitude = parseFloat(location.position.latitude);
                location.position.longitude = parseFloat(location.position.longitude);
            });
            controls = element.getAttribute('data-show-controls');
            mapOptions.center = locations[0].position;
            mapOptions.disableDefaultUI = controls !== 'true';
            mapOptions.mapTypeControl = controls === 'true';
            new GoogleMap(element, locations, mapOptions);
        }
    });

    /* End Google Maps */
});
