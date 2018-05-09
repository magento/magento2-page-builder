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
         * @param {Object} updateOptions
         */
        this.onUpdate = function (newMarkers, updateOptions) {
            this.map.setOptions(updateOptions);
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
                newMarkers.forEach(function (marker) {
                    var address = marker.address ? marker.address + '<br/>' : '';
                    var zip = marker.zip ? ',' + marker.zip : '';

                    var contentString =
                        '<div>' +
                        '<h3><b>' + marker.location + '</b></h3>' +
                        '<p>' + marker.comment + '</p>' +
                        '<p>' + address +
                        marker.city + zip + '<br/>' +
                        marker.country + '</p>' +
                        '</div>';

                    var infowindow = new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 350
                    });

                    var newMarker = new google.maps.Marker({
                        map: this.map,
                        position: googleLatLng(marker.coordinates),
                        title: marker.location
                    });

                    newMarker.addListener('click', function() {
                        infowindow.open(this.map, newMarker);
                    });

                    this.markers.push(newMarker);
                }, this);
            }
        };

        this.setMarkers(markers);
    };
});
