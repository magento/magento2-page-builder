/**
 * - tags.js
 * Abstract Field class for our fields
 * Uses Tag-it jQuery Ui Plugin
 *
 * @author Hob Adams <hob@gene.co.uk>
 */
define(['bluefoot/jquery', 'bluefoot/jquery/ui', 'bluefoot/hook', 'bluefoot/widget/abstract', 'jquery/tag-it'], function (jQuery, jQueryUi, Hook, AbstractField) {

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

        // Initialise Tag It <http://aehlke.github.io/tag-it/>
        jQuery('.gene-bluefoot-tag-it').tagit({
            singleFieldDelimiter: ' '
        });
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
            jQuery('<input />').attr('name', this.field.code).attr('type', this.getType()).attr('id', id).attr('class', 'gene-bluefoot-tag-it').val(this.value)
        );
        return this.element;
    };

    return InputField;
});