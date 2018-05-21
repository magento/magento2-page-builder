/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw'
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

    return function (element, markers, options) {
        var mapOptions = _.extend({
            zoom: 8,
            center: googleLatLng({
                lat: 30.2672,
                lng: -97.7431,
            }),
            scrollwheel: false,
            disableDoubleClickZoom: false,
            disableDefaultUI: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DEFAULT
            },
        }, options);

        /* Create the map */
        this.map = new google.maps.Map(element, mapOptions);
        this.markers = [];

        /**
         * Callback function on map config update
         * @param {Array} newMarker
         * @param {Object} updateOptions
         */
        this.onUpdate = function (newMarker, updateOptions) {
            this.map.setOptions(updateOptions);
            this.setMarker(newMarker);
        };

        /**
         * Sets the markers to selected map
         * @param {} newMarker
         */
        this.setMarker = function (newMarker) {
            this.markers.forEach(function (marker) {
                marker.setMap(null);
            }, this);
            this.markers = [];

            if (newMarker && !_.isEmpty(newMarker)) {
                var location = newMarker.location || '';
                var comment = newMarker.comment || '';
                var address = newMarker.address ? newMarker.address + '<br/>' : '';
                var city = newMarker.city || '';
                var country = newMarker.country || '';
                var zipcode = newMarker.zipcode ? ',' + newMarker.zipcode : '';

                var contentString =
                    '<div>' +
                    '<h3><b>' + location + '</b></h3>' +
                    '<p>' + comment + '</p>' +
                    '<p>' + address +
                    city + zipcode + '<br/>' +
                    country + '</p>' +
                    '</div>';

                var infowindow = new google.maps.InfoWindow({
                    content: contentString,
                    maxWidth: 350
                });

                var newCreatedMarker = new google.maps.Marker({
                    map: this.map,
                    position: googleLatLng(newMarker.coordinates),
                    title: newMarker.location
                });

                if(newMarker.location) {
                    newCreatedMarker.addListener('click', function() {
                        infowindow.open(this.map, newCreatedMarker);
                    }, this);
                }

                this.markers.push(newCreatedMarker);
            }
        };

        this.setMarker(markers);
    };
});
