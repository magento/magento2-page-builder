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

    return function (element, markers, options) {
        var mapOptions = _.extend({
            zoom: 8,
            center: googleLatLng({
                lat: 30.2672,
                lng: -97.7431
            }),
            scrollwheel: false,
            disableDoubleClickZoom: false,
            disableDefaultUI: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DEFAULT
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
         * @param {Object} newMarkers
         */
        this.setMarkers = function (newMarkers) {
            var activeInfoWindow,
                latlngbounds = new google.maps.LatLngBounds();

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
                        '<span>' + address +
                        city + cityComma + state + zipCode + lineBreak +
                        country + '</span>' +
                        '</div>',
                    infowindow = new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 350
                    }),
                    newCreatedMarker = new google.maps.Marker({
                        map: this.map,
                        position: googleLatLng(newMarker.position),
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
                    this.bounds.push(googleLatLng(newMarker.position));
                }, this);
            }

            /**
             * This sets the bounds of the map for multiple locations
             */
            if (this.bounds.length > 1) {
                this.bounds.forEach(function (bound) {
                    latlngbounds.extend(bound);
                });
                this.map.fitBounds(latlngbounds);
            }

            /**
             * Zoom to 8 if there is only a single location
             */
            if (this.bounds.length === 1) {
                this.map.setZoom(8);
            }
        };

        this.setMarkers(markers);
    };
});
