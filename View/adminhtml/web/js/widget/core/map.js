/**
 * map.js
 * Abstract Field class for our fields
 * Google maps pin widget
 *
 * @author Hob Adams <hob@gene.co.uk>
 */
define(['bluefoot/jquery', 'bluefoot/hook', 'bluefoot/widget/abstract'], function (jQuery, Hook, AbstractField) {

    /**
     * Extend our abstract class
     *
     * @param field
     * @param value
     * @param edit
     * @constructor
     */
    function InputField(field, value, edit) {
        AbstractField.call(this, field, value, edit);
    }
    InputField.prototype = Object.create(AbstractField.prototype);
    var $super = AbstractField.prototype;

    /**
     * Attach hooks for the color widget
     */
    InputField.prototype.attachHooks = function () {
        Hook.attach('gene-bluefoot-after-render-field-' + this.field.fieldType, this.onRenderField.bind(this), this.edit.stage);
    };


    /**
     * Google Maps init function
     */
    InputField.prototype.mapInit = function () {
        var id = this.getId();
        var map;
        var marker;
        var inputTextBox = jQuery('#' + id);

        // Get the start value
        if (inputTextBox.val()) {
            var startValue = inputTextBox.val();
        } else {
            var startValue = '50.821392, -0.139439, 8';
            // set the input value if empty
            inputTextBox.val(startValue);
        }

        // Convert the value into an array
        startValue = startValue.split(',');

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

        map = new google.maps.Map(document.getElementById(id + '_map_canvas'), mapOptions);

        // Edit existing location so that we need to display

        // Display default marker
        marker = new google.maps.Marker({
            draggable: true,
            map: map,
            position: centerLatlng
        });

        // After dragging, updates both Lat and Lng.
        google.maps.event.addListener(marker, 'dragend', function () {
            var curLatLng = marker.getPosition();

            inputTextBox.val(curLatLng.lat() + ',' + curLatLng.lng() + ',' + map.getZoom());
        });

        // Double click to allow pin placement
        google.maps.event.addListener(map, 'dblclick', function (e) {
            var curLatLng = e.latLng;
            marker.setPosition(curLatLng);
            inputTextBox.val(curLatLng.lat() + ',' + curLatLng.lng() + ',' + map.getZoom());
        });

        // Set zoom if changed
        map.addListener('zoom_changed', function () {
            var curLatLng = marker.getPosition();

            inputTextBox.val(curLatLng.lat() + ',' + curLatLng.lng() + ',' + map.getZoom());
        });

        google.maps.event.trigger(marker, "click");

    };

    /**
     * Event to call after the field has been placed onto the screen
     * @param $hook
     */
    InputField.prototype.onRenderField = function ($hook) {

        this.mapInit();
        $hook.done();
    };

    /**
     * Build the HTML
     *
     * @returns {boolean}
     */
    InputField.prototype.buildHtml = function () {
        var id = this.getId();
        this.element = jQuery('<div />').addClass('gene-bluefoot-input-field').append(
            jQuery('<label />').attr('for', id).html(this.getLabel()),
            jQuery('<input />').attr('name', this.field.code).attr('type', this.getType()).attr('id', id).addClass('gene-bluefoot-input-map-input').val(this.value),
            jQuery('<div />').attr('id', id + '_map_canvas').addClass('gene-bluefoot-input-map'),
            jQuery('<p />').addClass('gene-bluefoot-input-note').html(this.getNote())
        );
        return this.element;
    };

    return InputField;
});