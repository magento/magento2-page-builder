/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*eslint-disable vars-on-top, strict */

define([
    'Magento_Ui/js/form/element/abstract',
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw',
], function (AbstractField) {
    'use strict';

    var google = window.google || {};

    return AbstractField.extend({
        defaults: {
            elementTmpl: 'Magento_PageBuilder/form/element/map',
            map: false,
            marker: false
        },

        /**
         * Render the map into the field
         *
         * @param element
         */
        renderMap: function (element) {
            // Get the start value and convert the value into an array
            var startValue = this.value() ? this.value().split(',') : [30.2672, -97.7431, 8];

            var mapOptions = {
                zoom: parseInt(startValue[2], 10),
                center: new google.maps.LatLng(startValue[0], startValue[1]),
                scrollwheel: false,
                disableDoubleClickZoom: true,
                // mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DEFAULT
                },
                navigationControl: true,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.DEFAULT
                }
            };

            // Create the map
            this.map = new google.maps.Map(element, mapOptions);

            // Add marker if there is a start value
            if (this.value()) {
                this.addMarker(startValue[0], startValue[1]);
            }

            // After double click, add and update both Lat and Lng.
            google.maps.event.addListener(this.map, 'dblclick', this.onDoubleClick.bind(this));
            this.map.addListener('zoom_changed', this.onZoomChange.bind(this));
            google.maps.event.trigger(this.marker, 'click');
        },

        /**
         * Adds a map marker
         *
         * @param lat
         * @param lng
         */
        addMarker: function (lat, lng) {
            this.marker = new google.maps.Marker({
                draggable: true,
                map: this.map,
                position: new google.maps.LatLng(lat, lng)
            });
            google.maps.event.addListener(this.marker, 'dragend', this.onDragEnd.bind(this));
        },

        /**
         * Event for drag end to update value
         */
        onDragEnd: function () {
            this.value(this.exportValue());
        },

        /**
         * Event for double click to update marker
         *
         * @param event
         */
        onDoubleClick: function (event) {
            if(!this.marker) {
                this.addMarker(event.latLng.lat(), event.latLng.lng());
            }
            this.value(this.exportValue(event.latLng));
        },

        /**
         * Event for on zoom change to update zoom value
         */
        onZoomChange: function () {
            this.value(this.exportValue());
        },

        /**
         * Callback after an update to map
         */
        onUpdate: function () {
            this._super();

            if (!this.map || this.value() === ''|| this.value() === this.exportValue()) {
                return;
            }

            // Convert the value into an arrav
            var value  = this.value().split(','),
                latLng = new google.maps.LatLng(value[0], value[1]);

            this.marker.setPosition(latLng);
            this.map.setZoom(parseInt(value[2], 10));
            this.map.setCenter(latLng);
        },

        /**
         * Returns current latitude, longitude, and zoom level as a single string
         *
         * @param latLng
         * @return {string}
         */
        exportValue: function (latLng) {
            var curLatLng = latLng ? latLng : this.marker.getPosition();

            return curLatLng.lat() + ',' + curLatLng.lng() + ',' + this.map.getZoom();
        }
    });
});
