/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*global requirejs */

requirejs([
    'jquery',
    'highlight',
    'Magento_PageBuilder/js/utils/map',
    'jquery/ui',
    'slick',
    'jarallax'
], function ($, hljs, GoogleMap) {
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
        $('pre code:not(.hljs)').each(function (i, block) {
            $(block).html(
                hljs.highlight('html', $(block).html()).value
            );
        });

        $('div[data-role="slider"]').each(function (index, element) {
            if ($(element) && $(element).length > 0) {
                /**
                 * Prevent each slick slider from being initialized more than once which could throw an error.
                 */
                if ($(element).hasClass('slick-initialized')) {
                    $(element).slick('unslick');
                }

                $(element).slick({
                    autoplay: $(element).data('autoplay') === 1,
                    autoplaySpeed: $(element).data('autoplay-speed') || 0,
                    fade: $(element).data('fade') === 1,
                    infinite: $(element).data('is-infinite') === 1,
                    arrows: $(element).data('show-arrows') === 1,
                    dots: $(element).data('show-dots') === 1
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

        showOverlayOnHover($('div[data-role="slide"][data-show-overlay="on_hover"] > a'));
        showButtonOnHover($('div[data-role="slide"][data-show-button="on_hover"] > a'), '.pagebuilder-slide-button');

        $('div[data-role="tabs"]').each(function (index, element) {
            $(element).tabs({
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
            });
        });
    });

    /* Google Maps */
    $('div[data-role="map"]').each(function (index, element) {
        var markers = [],
            marker = [],
            location,
            address,
            city,
            comment,
            controls,
            country,
            zip,
            mapOptions = {};

        /**
         * Sets height to 300px as default if no height input. But will not be saved to database
         */
        if ($(element).context.style.height === '') {
            $(element).height('300px');
        }

        if (element.hasAttribute('data-markers') && element.getAttribute('data-markers') !== '[]') {
            markers = JSON.parse(element.getAttribute('data-markers'));
            location = element.getAttribute('data-location-name');
            address = element.getAttribute('data-address');
            city = element.getAttribute('data-city');
            comment = element.getAttribute('data-comment');
            country = element.getAttribute('data-country');
            zip = element.getAttribute('data-zip');
            controls = element.getAttribute('data-show-controls');
            marker = [{
                coordinates: markers[0],
                location: location,
                address: address,
                city: city,
                comment: comment,
                country: country,
                zip: zip
            }];

            mapOptions.center = markers[0];
            mapOptions.disableDefaultUI = controls !== 'true';
            mapOptions.mapTypeControl = controls === 'true';
            new GoogleMap(element, marker, mapOptions);
        }
    });

    /* End Google Maps */
});
