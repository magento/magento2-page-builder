/**
 * - Category.js
 *
 * @author Aidan Threadgold <aidan@gene.co.uk>
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
     * Attach hooks for the color widget
     */
    InputField.prototype.attachHooks = function () {
        Hook.attach('gene-bluefoot-after-render-field-' + this.field.fieldType, this.afterRenderField.bind(this), this.edit.stage);
    };

    /**
     * After the field has been added to the dom, instantiate the jQuery autocomplete instance
     * @param $hook
     */
    InputField.prototype.afterRenderField = function ($hook) {
        this.element.find('input').first().autocomplete({
            source: Config.getPluginConfig('gene_widget_search_category','source_url'),
            appendTo: "#" + this.getId() + "_wrapper",
            minLength: 2,
            select: function(event, ui) {
                jQuery( "#" + this.getId()).val(ui.item.id).data("category-name", ui.item.value);
                jQuery( "#" + this.getId()).val(ui.item.id).data("category-name", ui.item.value);
            }.bind(this),
            search: function(event, ui) {
                jQuery( "#" + this.getId()).parent().addClass("searching");
                jQuery("#" + this.getId() + "_autocomplete").removeClass("gene-bluefoot-field-failed");
            }.bind(this),
            open: function(event, ui) {
                jQuery( "#" + this.getId()).parent().removeClass("searching");

                var menu = jQuery( "#" + this.getId() + "_wrapper").find(".ui-autocomplete");
                if(menu.find(".ui-menu-item").length == 0) {
                    menu.hide();
                    jQuery("#" + this.getId() + "_autocomplete").addClass("gene-bluefoot-field-failed");
                }
            }.bind(this)
        });

        $hook.done();
    };

    /**
     * Build the dom element to represent this widget within the edit panel
     *
     * @returns object
     */
    InputField.prototype.buildHtml = function () {
        var id = this.getId(),
            fakeId = this.getId() + "_autocomplete",
            placeholder = '';

        // Get the category name for the placeholder text
        if( this.entity.data.hasOwnProperty("preview_view")
            && typeof this.entity.data["preview_view"][ this.field.code ] !== 'undefined'
            && typeof this.entity.data["preview_view"][ this.field.code ]["category"]["name"] !== 'undefined'
            && this.entity.data["preview_view"][ this.field.code ]["category"]["name"])
        {
            placeholder = this.entity.data["preview_view"][ this.field.code ]["category"]["name"];
        }

        // Build elements
        this.element = jQuery('<div />').addClass('gene-bluefoot-search-field gene-bluefoot-input-field gene-bluefoot-input-loading-indicator');
        this.element.attr("id", this.getId() + "_wrapper");
        this.element.append(
            jQuery('<i class="fa fa-spinner fa-pulse"></i>'),

            // Append label
            jQuery('<label />').attr('for', fakeId).html(this.getLabel()),

            // Append an input we're going to use for searching
            jQuery('<input />').attr({
                name: this.field.code + "_category_name",
                type: this.getType(),
                id: fakeId
            }).val(placeholder),

            // Append the actual input the CMS uses for saving
            jQuery('<input />').attr({
                name: this.field.code,
                type: 'hidden',
                id: id
            }).val(this.value)
        );

        // Attach field note
        if (typeof this.field.note !== 'undefined') {
            this.element.append(jQuery('<p />').addClass('gene-bluefoot-note').html(this.field.note));
        }

        return this.element;
    };

    return InputField;
});