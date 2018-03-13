/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw',
], function (_) {
    'use strict';

    var google = window.google || {};
    var googleLatLng = function(latLng) {
        return new google.maps.LatLng(latLng.lat, latLng.lng);
    };

    return function(element, markers, centerCoord, options){
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

        this.onUpdate = function(newMarkers,latLng, zoom){
            this.map.setZoom(parseInt(zoom, 10));
            this.map.setCenter(latLng);
            this.setMarkers(this.map, newMarkers);
        };

        this.setMarkers = function(map, newMarkers) {
                this.markers.forEach(function(marker){
                    marker.setMap(null);
                },this);
                this.markers = [];

                newMarkers.forEach(function(markerCoord) {
                this.markers.push(
                    new google.maps.Marker({
                        map: this.map,
                        position: googleLatLng(markerCoord),
                    })
                );
            }, this);
        };

        this.setMarkers(this.map, markers);

    };
});
