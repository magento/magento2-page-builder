/**
 * align.js
 * Widget for entity content alignment
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
     * Event to call after the field has been placed onto the screen
     * @param $hook
     */
    InputField.prototype.onRenderField = function ($hook) {
        if (this.value) {
            this.rebuildValues();
        }
        $hook.done();
    };

    /**
     * Build the values
     */
    InputField.prototype.rebuildValues = function () {
        var value = this.value;
        if (this.alignHtml.find('input').length > 0) {
            this.alignHtml.find('input').each(function(){
                if (jQuery(this).val() == value) {
                    jQuery(this).prop('checked', true);
                }
            })
        }
    };

    /**
     * Build the HTML
     *
     * @returns {boolean}
     */
    InputField.prototype.buildHtml = function () {
        var id = this.getId();
        var rand = Math.floor(Math.random() * 26) + Date.now();
        this.alignHtml = this.buildAlignHtml();
        var value = this.value;


        this.alignHtml.find('.gene-bluefoot-align-field').removeClass('active');
        var inputs = this.alignHtml.find('input[name="align"]');
        jQuery.each(inputs, function(){
            if (jQuery(this).val() == value) {
                jQuery(this).parents('.gene-bluefoot-align-field').addClass('active');
            }
        });

        //this.alignHtml.find('input[name="align"]:checked').parents('.gene-bluefoot-align-field').addClass('active');

        this.element = jQuery('<div />').addClass('gene-bluefoot-input-field').append(
            jQuery('<label />').html('Alignment'),
            jQuery('<input />').attr('name', this.field.code).attr('type', this.getType()).attr('id', id + rand).addClass('gene-bluefoot-align').val(value).hide(),
            this.alignHtml,
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
    InputField.prototype.buildAlignHtml = function () {

        // Generate unique id to avoid duplicate IDs
        var id = Math.floor(Math.random() * 26) + Date.now();

        return jQuery('<div />').addClass('gene-bluefoot-align gene-bluefoot-align-fields').append(
            jQuery('<input />').attr('name', 'align').attr('id', 'gene-bluefoot-align-none-' + id).attr('type', 'radio').val('none').prop('checked', true).hide(),
            jQuery('<div />').addClass('gene-bluefoot-align-left gene-bluefoot-align-field').append(
                jQuery('<label />').addClass('gene-bluefoot-align-label').attr('for', 'gene-bluefoot-align-left-' + id).html('<i class="fa fa-align-left"></i><span>Left</span>'),
                jQuery('<input />').attr('name', 'align').attr('id', 'gene-bluefoot-align-left-' + id).attr('type', 'radio').val('left')

            ),
            jQuery('<div />').addClass('gene-bluefoot-align-center gene-bluefoot-align-field').append(
                jQuery('<label />').addClass('gene-bluefoot-align-label').attr('for', 'gene-bluefoot-align-center-' + id).html('<i class="fa fa-align-center"></i><span>Center</span>'),
                jQuery('<input />').attr('name', 'align').attr('id', 'gene-bluefoot-align-center-' + id).attr('type', 'radio').val('center')

            ),
            jQuery('<div />').addClass('gene-bluefoot-align-right gene-bluefoot-align-field').append(
                jQuery('<label />').addClass('gene-bluefoot-align-label').attr('for', 'gene-bluefoot-align-right-' + id).html('<i class="fa fa-align-right"></i><span>Right</span>'),
                jQuery('<input />').attr('name', 'align').attr('id', 'gene-bluefoot-align-right-' + id).attr('type', 'radio').val('right')

            )
        );
    };

    /**
     * Bind an event to all inputs in the edit bar
     */
    InputField.prototype.bindEvents = function () {
        if (this.alignHtml.find('input').length > 0) {
            this.alignHtml.find('input').data('no-serialize', true);
            this.alignHtml.find('input').on('change', this.setAlign.bind(this));
        }
    };

    /**
     * Set the stored alignment
     *
     * @param event
     */
    InputField.prototype.setAlign = function (event) {
        this.alignHtml.find('.gene-bluefoot-align-field').removeClass('active');
        var current = this.alignHtml.find('input[name="align"]:checked');
        current.parents('.gene-bluefoot-align-field').addClass('active');
        this.element.find('input.gene-bluefoot-align').val(current.val());

        // Add the class onto the entity HTML
        if (typeof this.edit.entity !== 'undefined') {
            this.updateEntity(this.edit.entity, current.val());
        }
    };

    /**
     * Update the entity within the actual page builder
     *
     * @param entity
     * @param value
     */
    InputField.prototype.updateEntity = function (entity, value) {
        if (typeof entity.entity !== 'undefined') {
            jQuery(entity.entity).removeClass('bluefoot-entity-align-left bluefoot-entity-align-center bluefoot-entity-align-right');
            if (value != '') {
                jQuery(entity.entity).addClass('bluefoot-entity-align-' + value);
            }
        }
    };

    return InputField;
});