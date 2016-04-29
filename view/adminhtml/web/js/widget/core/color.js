/**
 * - Color.js
 * Abstract Field class for our fields
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

        // Initialise JS Color <http://jscolor.com/>
        if (typeof jscolor !== 'undefined') {
            jscolor.init();
        }
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
            jQuery('<input />').attr('name', this.field.code).attr('type', this.getType()).attr('id', id).addClass('color {required:false}').val(this.value)
        );

        if (typeof this.field.note !== 'undefined') {
            this.element.append(jQuery('<p />').addClass('gene-bluefoot-note').html(this.field.note));
        }

        return this.element;
    };

    return InputField;
});