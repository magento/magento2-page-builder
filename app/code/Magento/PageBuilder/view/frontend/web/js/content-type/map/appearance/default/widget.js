/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'Magento_PageBuilder/js/utils/map'
], function ($, GoogleMap) {
    'use strict';

    return function (config, element) {
        var locations,
            controls,
            mapOptions = {},
            $element = $(element);

        /**
         * Sets height to 300px as default if no height input. But will not be saved to database
         */
        if ($element.context.style.height === '') {
            $element.height('300px');
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
    };
});
