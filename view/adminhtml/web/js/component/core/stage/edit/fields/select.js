/**
 * - Input.js
 * Abstract Field class for our fields
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['jquery', 'bluefoot/widget/abstract'], function (jQuery, AbstractField) {

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
     * Build the HTML
     *
     * @returns {boolean}
     */
    InputField.prototype.buildHtml = function () {
        var id = this.getId();

        // Build our select element
        this.element = jQuery('<select />').attr('name', this.field.code).attr('id', id).val(this.value);
        if (this.getMultiple()) {
            this.element.attr('multiple', 'multiple').css({minHeight: '80px'});
        }

        this.initOptions(this.element);

        var field = jQuery('<div />').addClass('gene-bluefoot-input-field gene-bluefoot-select-field').append(
            jQuery('<label />').attr('for', id).html(this.getLabel()),
            this.element
        );

        if (typeof this.field.note !== 'undefined') {
            field.append(jQuery('<p />').addClass('gene-bluefoot-note').html(this.field.note));
        }

        return field;
    };

    /**
     * Init options for this select box
     *
     * @param select
     */
    InputField.prototype.initOptions = function (select) {
        // @todo optgroups
        if (typeof this.field.options !== 'undefined') {
            jQuery.each(this.field.options, function (index, option) {
                var optionElement = jQuery('<option />').attr('value', option.value).text(option.label);
                if (this.value == option.value) {
                    optionElement.attr('selected', 'selected');
                }
                select.append(optionElement);
            }.bind(this));
        }
    };

    /**
     * Get the type of the input
     *
     * @returns {*}
     */
    InputField.prototype.getMultiple = function () {
        return (typeof this.field.multiple !== 'undefined' && this.field.multiple == true);
    };

    return InputField;
});