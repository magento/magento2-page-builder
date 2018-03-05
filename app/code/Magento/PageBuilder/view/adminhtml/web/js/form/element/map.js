/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*eslint-disable vars-on-top, strict */

define([
    'Magento_Ui/js/form/element/abstract',
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw',
    'underscore',
    'mage/translate'
], function (AbstractField) {
    'use strict';

    return AbstractField.extend({
        defaults: {
            elementTmpl: 'Magento_PageBuilder/form/element/map',
            map: false,
            marker: false
        },

        /**
         * Render the map into the field
         *
         * @param {HTMLElement} element
         */
        renderMap: function (element) {
            var startValue,
                google = window.google || {},
                centerLatlng,
                mapOptions;

            // Get the start value
            if (!this.value()) {
                this.value('50.821392,-0.139439,8');
            }

            // Convert the value into an array
            startValue = this.value().split(',');
            centerLatlng = new google.maps.LatLng(startValue[0], startValue[1]);
            mapOptions = {
                zoom: parseInt(startValue[2], 10),
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

            google.maps.event.trigger(this.marker, 'click');
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
         * @param {Event} event
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

        /**
         * Event fired when field value is updated
         */
        onUpdate: function () {
            var google = window.google || {},
                value,
                latLng;

            this._super();

            if (!this.map || this.value() === '' || this.value() === this.exportValue()) {
                return;
            }

            // Convert the value into an arrav
            value  = this.value().split(',');
            latLng = new google.maps.LatLng(value[0], value[1]);

            this.marker.setPosition(latLng);
            this.map.setZoom(parseInt(value[2], 10));
            this.map.setCenter(latLng);
        },

        /**
         * @param {LatLng} latLng
         * @returns {String}
         */
        exportValue: function (latLng) {
            var curLatLng = latLng ? latLng : this.marker.getPosition();

            return curLatLng.lat() + ',' + curLatLng.lng() + ',' + this.map.getZoom();
        }
    });
});
