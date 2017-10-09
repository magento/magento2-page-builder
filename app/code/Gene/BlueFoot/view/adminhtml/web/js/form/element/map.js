/**
 * Map UI Component
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'Magento_Ui/js/form/element/abstract',
    'underscore',
    'mage/translate',
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyBrASRp1DMfGbE8LKIb9tusSvAZRYZR6J4'
], function (AbstractField, _, $t) {
    'use strict';

    return AbstractField.extend({
        defaults: {
            map: false,
            marker: false
        },

        /**
         * Render the map into the field
         *
         * @param element
         */
        renderMap: function (element) {
            var startValue,
                google = window.google || {};

            // Get the start value
            if (!this.value()) {
                this.value('50.821392, -0.139439, 8');
            }

            // Convert the value into an array
            startValue = this.value().split(',');

            var centerLatlng = new google.maps.LatLng(startValue[0], startValue[1]);

            var mapOptions = {
                zoom: parseInt(startValue[2]),
                center: centerLatlng,
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

            // Create the map and marker
            this.map = new google.maps.Map(element, mapOptions);
            this.marker = new google.maps.Marker({
                draggable: true,
                map: this.map,
                position: centerLatlng
            });

            // After dragging, updates both Lat and Lng.
            google.maps.event.addListener(this.marker, 'dragend', this.onDragEnd.bind(this));
            google.maps.event.addListener(this.map, 'dblclick', this.onDoubleClick.bind(this));

            this.map.addListener('zoom_changed', this.onZoomChange.bind(this));

            google.maps.event.trigger(this.marker, "click");
        },

        /**
         * Event for drag end to update value
         */
        onDragEnd: function () {
            var curLatLng = this.marker.getPosition();
            this.value(curLatLng.lat() + ',' + curLatLng.lng() + ',' + this.map.getZoom());
        },

        /**
         * Event for double click to update marker
         *
         * @param event
         */
        onDoubleClick: function (event) {
            var curLatLng = event.latLng;
            this.marker.setPosition(curLatLng);
            this.value(curLatLng.lat() + ',' + curLatLng.lng() + ',' + this.map.getZoom());
        },

        /**
         * Event for on zoom change to update zoom value
         */
        onZoomChange: function () {
            var curLatLng = this.marker.getPosition();
            this.value(curLatLng.lat() + ',' + curLatLng.lng() + ',' + this.map.getZoom());
        }
    });
});
