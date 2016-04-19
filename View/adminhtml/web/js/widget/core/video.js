/**
 * - Product.js
 *
 * @author Chloe Langford <chloe@gene.co.uk>
 */
define(['bluefoot/config', 'bluefoot/jquery', 'bluefoot/hook', 'bluefoot/widget/abstract'], function (Config, jQuery, Hook, AbstractField) {

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
     * Attach hooks for the video widget
     */
    InputField.prototype.attachHooks = function () {
        Hook.attach('gene-bluefoot-after-render-field-' + this.field.fieldType, this.onRenderField.bind(this), this.edit.stage);
    };

    /**
     * Get the preview iframe
     */
    InputField.prototype.getPreview = function () {
        var value = jQuery('#' + this.getId()).val();
        jQuery.ajax({
            type: "GET",
            url: Config.getPluginConfig('gene_widget_video','source_url'),
            data: {
                'url' : encodeURI(value)
            },
            success: function (data) {

                // Remove searching icon
                jQuery( "#" + this.getId()).parent().removeClass('searching');

                if (!value) {
                    // Remove error message and video if no content in input
                    jQuery('#gene-bluefoot-video-iframe').hide().empty();
                } else if (data === undefined || (!data) || (!data.key)) {
                    // If data doesn't return content throw error, else show video
                    jQuery('#gene-bluefoot-video-iframe').hide().html('<span><i class="fa fa-times"></i>Uh, oh we can\'t seem to find that video</span>').fadeIn('slow')
                } else {

                    // Add class success
                    jQuery( "#" + this.getId()).parent().addClass('success');
                    jQuery('#gene-bluefoot-video-iframe').hide().html('<div class="gene-bluefoot-video-container"><iframe src="' + data.key + '"></iframe></div>').fadeIn('slow')
                }

            }.bind(this)
        });
    };

    /**
     * Build the dom element to represent this widget within the edit panel
     *
     * @returns object
     */
    InputField.prototype.buildHtml = function () {

        var input = jQuery('<input />').attr({
            name: this.field.code,
            type: this.getType(),
            id: this.getId()
        }).val(this.value);

        // Build elements
        this.element = jQuery('<div />').addClass('gene-bluefoot-input-field');
        this.element.attr("id", this.getId() + "_wrapper");
        this.element.append(
            jQuery('<div />').addClass('gene-bluefoot-input-field-video-container gene-bluefoot-input-loading-indicator').append(

                // Append icons
                jQuery('<i class="fa fa-spinner fa-pulse"></i>'),
                jQuery('<i class="fa fa-check"></i>'),

                // Append label
                jQuery('<label />').attr('for', this.getId()).html(this.getLabel()),

                // Append an input we're going to use for searching
                input,

                jQuery('<div />').attr('id', 'gene-bluefoot-video-iframe').addClass('gene-bluefoot-video-iframe'),
                jQuery('<div />')
            )
        );

        var timeout = false,
            container = jQuery('.gene-bluefoot-input-field-video-container');

        input.on('keyup', function (event) {

            clearTimeout(timeout);
            timeout = setTimeout(function () {
                this.getPreview();
                jQuery( "#" + this.getId()).parent().removeClass('success');
                jQuery( "#" + this.getId()).parent().addClass('searching');
            }.bind(this), 500);

        }.bind(this));

        // Attach field note
        if(typeof this.field.note !== 'undefined') {
            this.element.append(jQuery('<p />').addClass('gene-bluefoot-note').html(this.field.note));
        }

        return this.element;
    };

    InputField.prototype.onRenderField = function ($hook) {
        var input = this.buildHtml().find('#' + this.getId());
        // Only do anything if the input has content
        if (input.val()) {
            this.getPreview();
        }
        $hook.done();
    };

    return InputField;
});