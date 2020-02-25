/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * googleMaps dependency is added within googlemaps.phtml through shim based on API key being set
 *
 * @api
 */
define([
    'underscore',
    'module',
    'Magento_PageBuilder/js/events'
], function (_, module, events) {
    'use strict';

    var google = window.google || {},

        /**
         * Generates a google map usable latitude and longitude object
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

        // If we've previously had an API key error, throw the error even again
        if (gmAuthFailure) {
            events.trigger('googleMaps:authFailure');

            return;
        }

        // If Google Maps isn't loaded don't try init the map, it won't work
        if (typeof google.maps === 'undefined') {
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
                    var location = _.escape(newMarker['location_name']) || '',
                    comment = newMarker.comment ?
                        '<p>' + _.escape(newMarker.comment).replace(/(?:\r\n|\r|\n)/g, '<br/>') + '</p>'
                        : '',
                    phone = newMarker.phone ? '<p>Phone: ' + _.escape(newMarker.phone) + '</p>' : '',
                    address = newMarker.address ? _.escape(newMarker.address) + '<br/>' : '',
                    city = _.escape(newMarker.city) || '',
                    country = newMarker.country ? _.escape(newMarker.country) : '',
                    state = newMarker.state ? _.escape(newMarker.state) + ' ' : '',
                    zipCode = newMarker.zipcode ? _.escape(newMarker.zipcode) : '',
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
