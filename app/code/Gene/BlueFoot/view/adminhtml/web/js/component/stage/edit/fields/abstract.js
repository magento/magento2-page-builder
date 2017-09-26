/**
 * - Abstract.js
 *
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */
define(function () {

    /**
     * Abstract field class
     *
     * @param field
     * @param value
     * @param edit
     * @param blockInit
     * @constructor
     */
    function InputField(field, value, edit, blockInit) {
        this.field = field;
        this.value = value;
        this.element = false;
        this.edit = edit;
        this.entity = edit.entity;

        // Allow the field to be created without being fully initialized
        if (blockInit !== true) {
            this.attachHooks();
        }
    }

    /**
     * Attach hooks for the color widget
     */
    InputField.prototype.attachHooks = function () {
        return false;
    };

    /**
     * Build the dom element to represent this widget within the edit panel
     *
     * @returns object
     */
    InputField.prototype.buildHtml = function () {
        return null;
    };

    /**
     * Return the label for this field
     *
     * @returns {*}
     */
    InputField.prototype.getLabel = function () {
        var label = this.field.label;
        if (typeof this.field.required !== 'undefined' && this.field.required == true) {
            label += '<em>*</em>';
        }
        return label;
    };

    /**
     * Return the elements ID
     *
     * @returns {string}
     */
    InputField.prototype.getId = function () {
        return 'gene-bluefoot' + this.getType() + '_' + this.field.code;
    };

    /**
     * Get the type of the input
     *
     * @returns {*}
     */
    InputField.prototype.getType = function () {
        if (typeof this.field.input_type !== 'undefined') {
            return this.field.input_type;
        }
        return 'text';
    };

    /**
     * Return the note for this field
     *
     * @returns {*}
     */
    InputField.prototype.getNote = function () {
        if (typeof this.field.note !== 'undefined') {
            return this.field.note;
        }

        return null;
    };

    return InputField;
});