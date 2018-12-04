/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
define([
    'underscore',
    'module',
    'Magento_PageBuilder/js/events',
    'mage/translate',
    'googleMaps'
], function (_, module, events, $t) {
    'use strict';

    var google = window.google || {},

        /**
         * Generates a google map usuable latitude and longitude object
         *
         * @param {Object} position
         * @return {google.maps.LatLng}
         */
        getGoogleLatitudeLongitude = function (position) {
            return new google.maps.LatLng(position.latitude, position.longitude);
        },
        gmAuthFailure = false;

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    /**
     * Google's error listener for map loader failures
     */
    window.gm_authFailure = function () {
        events.trigger('googleMaps:authFailure');
        gmAuthFailure = true;
    };
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

    return function (element, markers, additionalOptions) {
        var options,
            style;

        /**
         * Replace the content of element with a placeholder
         *
         * @param {Element} container
         */
        this.usePlaceholder = function (container) {
            var placeholder = document.createElement('div');

            placeholder.innerHTML = $t('Enter valid API Key to use Google Maps');
            placeholder.classList.add('google-map-auth-failure-placeholder');
            container.innerHTML = '';
            container.appendChild(placeholder);
        };

        //Terminate map early and add placeholder if gm_authFailure is true
        if (gmAuthFailure) {
            this.usePlaceholder(element);

            return;
        }

        /**
         * Just in case of a bad JSON that bypassed validation
         */
        try {
            style = module.config().style ? JSON.parse(module.config().style) : [];
        }
        catch (error) {
            style = [];
        }
        options = _.extend({
            zoom: 8,
            center: getGoogleLatitudeLongitude({
                latitude: 30.2672,
                longitude: -97.7431
            }),
            scrollwheel: false,
            disableDoubleClickZoom: false,
            disableDefaultUI: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DEFAULT
            },
            styles: style
        }, additionalOptions);

        /* Create the map */
        this.map = new google.maps.Map(element, options);
        this.markers = [];

        /**
         * Callback function on map config update
         * @param {Array} newMarkers
         * @param {Object} updateOptions
         */
        this.onUpdate = function (newMarkers, updateOptions) {
            this.map.setOptions(updateOptions);
            this.setMarkers(newMarkers);
        };

        /**
         * Sets the markers to selected map
         * @param {Object} newMarkers
         */
        this.setMarkers = function (newMarkers) {
            var activeInfoWindow,
                latitudeLongitudeBounds = new google.maps.LatLngBounds();

            this.markers.forEach(function (marker) {
                marker.setMap(null);
            }, this);

            this.markers = [];
            this.bounds = [];

            /**
             * Creates and set listener for markers
             */
            if (newMarkers && newMarkers.length) {
                newMarkers.forEach(function (newMarker) {
                    var location = newMarker['location_name'] || '',
                    comment = newMarker.comment ?
                        '<p>' + newMarker.comment.replace(/(?:\r\n|\r|\n)/g, '<br/>') + '</p>'
                        : '',
                    phone = newMarker.phone ? '<p>Phone: ' + newMarker.phone + '</p>' : '',
                    address = newMarker.address ? newMarker.address + '<br/>' : '',
                    city = newMarker.city || '',
                    country = newMarker.country ? newMarker.country : '',
                    state = newMarker.state ? newMarker.state + ' ' : '',
                    zipCode = newMarker.zipcode ? newMarker.zipcode : '',
                    cityComma = city !== '' && (zipCode !== '' || state !== '') ? ', ' : '',
                    lineBreak = city !== '' || zipCode !== '' ? '<br/>' : '',
                    contentString =
                        '<div>' +
                        '<h3><b>' + location + '</b></h3>' +
                        comment +
                        phone +
                        '<p><span>' + address +
                        city + cityComma + state + zipCode + lineBreak +
                        country + '</span></p>' +
                        '</div>',
                    infowindow = new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 350
                    }),
                    newCreatedMarker = new google.maps.Marker({
                        map: this.map,
                        position: getGoogleLatitudeLongitude(newMarker.position),
                        title: location
                    });

                    if (location) {
                        newCreatedMarker.addListener('click', function () {
                            if (activeInfoWindow) {
                                activeInfoWindow.close();
                            }

                            infowindow.open(this.map, newCreatedMarker);
                            activeInfoWindow = infowindow;
                        }, this);
                    }

                    this.markers.push(newCreatedMarker);
                    this.bounds.push(getGoogleLatitudeLongitude(newMarker.position));
                }, this);
            }

            /**
             * This sets the bounds of the map for multiple locations
             */
            if (this.bounds.length > 1) {
                this.bounds.forEach(function (bound) {
                    latitudeLongitudeBounds.extend(bound);
                });
                this.map.fitBounds(latitudeLongitudeBounds);
            }

            /**
             * Zoom to 8 if there is only a single location
             */
            if (this.bounds.length === 1) {
                this.map.setCenter(this.bounds[0]);
                this.map.setZoom(8);
            }
        };

        this.setMarkers(markers);
    };
});
