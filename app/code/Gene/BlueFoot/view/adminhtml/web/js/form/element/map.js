/**
 * Map UI Component
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'Magento_Ui/js/form/element/abstract',
    'underscore',
    'mage/translate',
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw'
], function (AbstractField, _, $t) {
    'use strict';

    return AbstractField.extend({
        defaults: {
            elementTmpl: 'Gene_BlueFoot/form/element/map',
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
                this.value('50.821392,-0.139439,8');
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
            this.value(this.exportValue());
        },

        /**
         * Event for double click to update marker
         *
         * @param event
         */
        onDoubleClick: function (event) {
            this.value(this.exportValue(event.latLng));
        },

        /**
         * Event for on zoom change to update zoom value
         */
        onZoomChange: function () {
            this.value(this.exportValue());
        },
        onUpdate: function () {
            this._super();

            if (!this.map || this.value() === ''|| this.value() === this.exportValue()) {
                return;
            }

            // Convert the value into an arrayv
            var value  = this.value().split(','),
                latLng = new google.maps.LatLng(value[0], value[1]);
            this.marker.setPosition(latLng);
            this.map.setZoom(parseInt(value[2]));
            this.map.setCenter(latLng);
        },
        exportValue: function (latLng) {
            var curLatLng = latLng ? latLng : this.marker.getPosition();
            return curLatLng.lat() + ',' + curLatLng.lng() + ',' + this.map.getZoom();
        }
    });
});
