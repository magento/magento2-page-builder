/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'googleMaps'
], function (_) {
    'use strict';

    var google = window.google || {},

        /**
         * Generates a google map usuable lat and lng object
         *
         * @param {Object} latLng
         * @return {google.maps.LatLng}
         */
        googleLatLng = function (latLng) {
            return new google.maps.LatLng(latLng.lat, latLng.lng);
        };

    return function (element, markers, centerCoord, options) {
        var mapOptions = _.extend({
            zoom: 8,
            center: googleLatLng(centerCoord),
            scrollwheel: false,
            disableDoubleClickZoom: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DEFAULT
            },
            navigationControl: true,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.DEFAULT
            }
        }, options);

        /* Create the map */
        this.map = new google.maps.Map(element, mapOptions);
        this.markers = [];

        /**
         * Callback function on map config update
         * @param {Array} newMarkers
         * @param {Object} latLng
         * @param {Number} zoom
         */
        this.onUpdate = function (newMarkers, latLng, zoom) {
            this.map.setZoom(parseInt(zoom, 10));
            this.map.setCenter(latLng);
            this.setMarkers(newMarkers);
        };

        /**
         * Sets the markers to selected map
         * @param {Array} newMarkers
         */
        this.setMarkers = function (newMarkers) {
            this.markers.forEach(function (marker) {
                marker.setMap(null);
            }, this);
            this.markers = [];

            if (newMarkers) {
                newMarkers.forEach(function (markerCoord) {
                    this.markers.push(
                        new google.maps.Marker({
                            map: this.map,
                            position: googleLatLng(markerCoord)
                        })
                    );
                }, this);
            }
        };

        this.setMarkers(markers);
    };
});
