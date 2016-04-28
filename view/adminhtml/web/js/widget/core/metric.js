/**
 * metric.js
 * Widget for entity padding + margins
 *
 * @author Dave Macaulay <dave@gene.co.uk>
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
     * Event to call after the field has been placed onto the screen
     * @param $hook
     */
    InputField.prototype.onRenderField = function ($hook) {
        if (this.value) {
            this.rebuildValues();
        }
        $hook.done();
    };

    InputField.prototype.rebuildValues = function () {
        var value = JSON.parse(this.value);
        jQuery.each(value, function (key, values) {
            if (values && values != '') {
                var valuesArray = values.split(' ');
                jQuery.each(valuesArray, function (index, value) {
                    this.metricHtml.find('[name="metric[' + key + '][' + (index + 1) + ']"]').val(value);
                }.bind(this));
            }
        }.bind(this));
    };

    /**
     * Build the HTML
     *
     * @returns {boolean}
     */
    InputField.prototype.buildHtml = function () {
        var id = this.getId();
        this.metricHtml = this.buildMetricHtml();
        this.element = jQuery('<div />').addClass('gene-bluefoot-input-field').append(
            jQuery('<label />').html('Metrics'),
            jQuery('<input />').attr('name', this.field.code).attr('type', this.getType()).attr('id', id).addClass('gene-bluefoot-metric').val(this.value).hide(),
            this.metricHtml,
            jQuery('<p />').addClass('gene-bluefoot-input-note').html(this.getNote())
        );
        this.bindEvents();
        return this.element;
    };

    /**
     * Add a lot of input fields to the page for the various operations
     *
     * @returns {*}
     */
    InputField.prototype.buildMetricHtml = function () {
        return jQuery('<div />').addClass('gene-bluefoot-metric gene-bluefoot-metric-fields').append(
            jQuery('<div />').addClass('gene-bluefoot-metric-margin gene-bluefoot-metric-fields').append(
                jQuery('<label />').addClass('gene-bluefoot-metric-label').html('Margin'),
                jQuery('<input />').attr('name', 'metric[margin][1]').addClass('gene-bluefoot-metric-top'),
                jQuery('<input />').attr('name', 'metric[margin][2]').addClass('gene-bluefoot-metric-right'),
                jQuery('<input />').attr('name', 'metric[margin][3]').addClass('gene-bluefoot-metric-bottom'),
                jQuery('<input />').attr('name', 'metric[margin][4]').addClass('gene-bluefoot-metric-left'),
                jQuery('<div />').addClass('gene-bluefoot-metric-padding gene-bluefoot-metric-fields').append(
                    jQuery('<label />').addClass('gene-bluefoot-metric-label').html('Padding'),
                    jQuery('<input />').attr('name', 'metric[padding][1]').addClass('gene-bluefoot-metric-top'),
                    jQuery('<input />').attr('name', 'metric[padding][2]').addClass('gene-bluefoot-metric-right'),
                    jQuery('<input />').attr('name', 'metric[padding][3]').addClass('gene-bluefoot-metric-bottom'),
                    jQuery('<input />').attr('name', 'metric[padding][4]').addClass('gene-bluefoot-metric-left')
                )
            )
        );
    };


    /**
     * Bind an event to all inputs in the edit bar
     */
    InputField.prototype.bindEvents = function () {
        if (this.metricHtml.find('input').length > 0) {
            this.metricHtml.find('input').data('no-serialize', true);
            this.metricHtml.find('input').on('keyup', this.serializeMetrics.bind(this));
        }
    };

    /**
     * Serialized the stored metrics
     *
     * @param event
     */
    InputField.prototype.serializeMetrics = function (event) {
        var inputs = this.metricHtml.find('input');
        var fieldData = {};
        jQuery.each(inputs, function (key, element) {
            var name = jQuery(element).attr('name');
            var parseName = name.match(/[^[\]]+(?=])/g);
            if (typeof fieldData[parseName[0]] === 'undefined') {
                fieldData[parseName[0]] = [];
            }
            if (jQuery(element).val() == '' || jQuery(element).val() == '-') {
                fieldData[parseName[0]][parseName[1]] = '-';
            } else if (jQuery(element).val().indexOf('%') != -1 || jQuery(element).val().indexOf('px') != -1){
                fieldData[parseName[0]][parseName[1]] = jQuery(element).val();
            } else {
                fieldData[parseName[0]][parseName[1]] = jQuery(element).val() + 'px';
            }
        });

        var inputData = {};


        jQuery.each(fieldData, function (type, values) {
            inputData[type] = values.join(' ').trim();
        });

        this.element.find('input.gene-bluefoot-metric').val(JSON.stringify(inputData));
    };

    return InputField;
});