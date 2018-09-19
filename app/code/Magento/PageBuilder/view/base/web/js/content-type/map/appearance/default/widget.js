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
            mapOptions = {};

        element = element[0];

        if (element !== undefined && element.hasAttribute('data-locations')) {

            /**
             * Set map display to none if no locations
             */
            if (element.getAttribute('data-locations') === '[]') {
                $(element).hide();

                return;
            }
            locations = JSON.parse(element.getAttribute('data-locations'));
            locations.forEach(function (location) {
                location.position.latitude = parseFloat(location.position.latitude);
                location.position.longitude = parseFloat(location.position.longitude);
            });
            controls = element.getAttribute('data-show-controls');
            mapOptions.disableDefaultUI = controls !== 'true';
            mapOptions.mapTypeControl = controls === 'true';
            new GoogleMap(element, locations, mapOptions);
        }
    };
});
