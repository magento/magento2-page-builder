/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*eslint-disable vars-on-top, strict */

define([
    'Magento_Ui/js/form/element/abstract',
    'googleMaps'
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
         * @param {HTMLElement} element
         */
        renderMap: function (element) {
            // Get the start value and convert the value into an array
            var startValue = this.value(),
                mapOptions;

            if (typeof startValue === 'string' && startValue !== '') {
                startValue = JSON.parse(startValue);
            }

            mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(
                    !isNaN(startValue.lat) && startValue.lat !== '' ? startValue.lat : 30.2672,
                    !isNaN(startValue.lng) && startValue.lng !== '' ? startValue.lng : -97.7431
                ),
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
            };

            // Create the map
            this.map = new google.maps.Map(element, mapOptions);

            // Add marker if there is a start value
            if (this.value()) {
                this.addMarker(startValue.lat, startValue.lng);
            }

            // After click, add and update both Lat and Lng.
            google.maps.event.addListener(this.map, 'click', this.onClick.bind(this));
            google.maps.event.addListener(this.map, 'dblclick', this.onDblClick.bind(this));
            google.maps.event.trigger(this.marker, 'click');
        },

        /**
         * Adds a map marker
         *
         * @param {String} latitude
         * @param {String} longitude
         */
        addMarker: function (latitude, longitude) {
            this.marker = new google.maps.Marker({
                draggable: true,
                map: this.map,
                position: new google.maps.LatLng(latitude, longitude)
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
         * Event for click to update marker, delayed by 300ms in case of double click
         *
         * @param {Event} event
         */
        onClick: function (event) {
            this.clickTimer = setTimeout(function () {
                if (!this.marker) {
                    this.addMarker(event.latLng.lat(), event.latLng.lng());
                }
                this.value(this.exportValue(event.latLng));
            }.bind(this), 300);
        },

        /**
         * Event for double click to prevent call from single click
         */
        onDblClick: function () {
            clearTimeout(this.clickTimer);
        },

        /**
         * Callback after an update to map
         */
        onUpdate: function () {
            this._super();
            var content = this.value(),
                latitudeLongitude;

            if (this.marker && content.lat === '' && content.lng === '') {
                this.marker.setMap(null);
                delete this.marker;

                return;
            }

            if (!this.validateCoordinate(content) ||
                !this.map ||
                this.value() === '' ||
                this.value() === this.exportValue()) {
                return;
            }

            if (typeof this.value() === 'string' && this.value() !== '') {
                content = JSON.parse(this.value());
            }

            latitudeLongitude = new google.maps.LatLng(parseFloat(content.lat), parseFloat(content.lng));

            if (!this.marker) {
                this.addMarker(latitudeLongitude.lat(), latitudeLongitude.lng());
            }

            this.marker.setPosition(latitudeLongitude);
            this.map.setCenter(latitudeLongitude);
        },

        /**
         * Coordinate validation
         *
         * @param {Object} coordinates
         * @return {Boolean}
         */
        validateCoordinate: function (coordinates) {
            var valid = true;

            if (coordinates.lng === '' ||
                coordinates.lat === '' ||
                isNaN(coordinates.lng) ||
                isNaN(coordinates.lat) ||
                parseFloat(coordinates.lng) < -180 ||
                parseFloat(coordinates.lng) > 180 ||
                parseFloat(coordinates.lat) < -90 ||
                parseFloat(coordinates.lat) > 90
            ) {
                valid = false;
            }

            return valid;
        },

        /**
         * Returns current lat, lng, and zoom level as a single string
         *
         * @param {Object} coordinate
         * @return {Object}
         */
        exportValue: function (coordinate) {
            var position = this.marker ?
                this.marker.getPosition() : new google.maps.LatLng(this.map.center.lat(), this.map.center.lng()),
                currentCoordinate = coordinate ? coordinate : position;

            return {
                lat: currentCoordinate.lat(),
                lng: currentCoordinate.lng()
            };
        }
    });
});
