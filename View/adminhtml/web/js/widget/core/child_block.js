/**
 * - Child_Blocks.js
 * Abstract Field class for our fields
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['bluefoot/jquery', 'bluefoot/jquery/ui', 'bluefoot/config', 'bluefoot/hook'], function (jQuery, jQueryUi, Config, Hook) {

    /**
     * Handles child block relationships
     *
     * @param field
     * @param value
     * @param edit
     * @constructor
     */
    function ChildBlock(field, value, edit) {
        this.field = field;
        this.value = value;
        this.edit = edit;

        this.entity = edit.entity;
        this.stage = edit.stage;
        this.htmlOptions = false;

        this.element = false;
        this.elementHtml = false;
        this.addButton = false;
    }

    /**
     * Build the HTML
     *
     * @returns {boolean}
     */
    ChildBlock.prototype.buildHtml = function () {
        var id = this.getId();

        // Build our select element
        this.element = jQuery('<select />').attr('name', this.field.code).attr('id', id).val(this.value).attr('multiple', 'multiple').hide();
        this.element.data('serialize', this.serialize.bind(this));
        this.initOptions(this.element);

        this.elementHtml = this.buildChildBlockHtml();

        var field = jQuery('<div />').addClass('gene-bluefoot-input-field gene-bluefoot-child-blocks-field').append(
            jQuery('<label />').attr('for', id).html(this.getLabel()),
            this.element,
            this.elementHtml
        );

        if (typeof this.field.note !== 'undefined') {
            field.append(jQuery('<p />').addClass('gene-bluefoot-note').html(this.field.note));
        }

        return field;
    };

    /**
     * Build the HTML for the UI
     *
     * @returns {*}
     */
    ChildBlock.prototype.buildChildBlockHtml = function () {
        return jQuery('<div />').addClass('gene-bluefoot-child-blocks gene-bluefoot-child-blocks-' + this.field.code).append(
            this.initHtmlOptions(),
            this.buildAddButton()
        );
    };

    /**
     * Called when the systems attempts to serialize the form
     *
     * @param element
     * @param entity
     * @param serializedObject
     */
    ChildBlock.prototype.serialize = function (element, entity, serializedObject) {
        // Pass the children over to the entity
        var name = jQuery(element).attr('name');
        var children = jQuery(this.htmlOptions).find('[data-flagged]');
        if (typeof entity.children !== 'object') {
            entity.children = {};
        }
        if (children.length) {
            entity.children[name] = [];
            jQuery.each(children, function (index, child) {
                if (jQuery(child).data('class')) {
                    entity.children[name].push(jQuery(child).data('class'));
                }
            });
        } else {
            entity.children[name] = [];
        }

        // Set the amount of children onto the field
        if (typeof serializedObject !== 'object') {
            serializedObject = {};
        }
        if (children.length > 0) {
            serializedObject[name] = children.length;
        } else {
            serializedObject[name] = '';
        }
    };

    /**
     * Build the add new element button
     *
     * @returns {boolean|*}
     */
    ChildBlock.prototype.buildAddButton = function () {
        var config = this.getChildConfig();
        this.addButton = jQuery('<button />').attr('type', 'button').html(config.icon + ' Add ' + config.name).addClass('gene-bluefoot-button gene-bluefoot-button-full-width gene-bluefoot-child-item-button');
        this.bindButtonEvents(this.addButton);
        return this.addButton;
    };

    /**
     * Lighten a hex code
     *
     * @param hex
     * @param lum
     * @returns {string}
     */
    ChildBlock.prototype.shadeColor = function (hex, lum) {
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }

        return rgb;
    };

    /**
     * Bind the button events
     *
     * @param button
     */
    ChildBlock.prototype.bindButtonEvents = function (button) {
        var config = this.getChildConfig();

        // Attach the event to open the child edit view
        button.on('click', this.openChildEdit.bind(this))
    };

    /**
     * Open another version of the edit functionality
     *
     * @param event
     */
    ChildBlock.prototype.openChildEdit = function (event) {
        event.stopPropagation();

        // Add a new entity with this field as it's parent
        this.stage.addEntity(this.field.child_block_type, false, this.htmlOptions, false, function (entity) {
            entity.editParent = this.edit;
            entity.configure();
            this.initSortable();
        }.bind(this));
    };

    /**
     * Return the label for this field
     *
     * @returns {*}
     */
    ChildBlock.prototype.getLabel = function () {
        var label = this.field.label;
        if (typeof this.field.required !== 'undefined' && this.field.required == true) {
            label += '<em>*</em>';
        }
        return label;
    };

    /**
     * Init options for this select box
     *
     * @param select
     */
    ChildBlock.prototype.initOptions = function (select) {
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
     * Init html options
     *
     * @returns {*}
     */
    ChildBlock.prototype.initHtmlOptions = function () {
        this.htmlOptions = jQuery('<div />').addClass('gene-bluefoot-child-blocks-container gene-bluefoot-droppable');

        if (typeof this.entity.children === 'object' && typeof this.entity.children[this.field.code] !== 'undefined') {
            jQuery.each(this.entity.children[this.field.code], function (index, child) {
                child.parent = this.htmlOptions;
                child.editParent = this.edit;
                child.disablePreview = true;
                child.init();
            }.bind(this));

            this.initSortable();
        }

        return this.htmlOptions;
    };

    /**
     * Add the ability to sort the child blocks
     */
    ChildBlock.prototype.initSortable = function () {
        jQuery(this.htmlOptions).sortable({
            tolerance: 'pointer',
            helper: 'clone',
            cancel: 'a',
            placeholder: 'gene-bluefoot-droparea',
            items: '.gene-bluefoot-entity',
            opacity: 0.7,
            change: function (event, ui) {
                Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);
            },
            stop: function (event, ui) {
                Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);
            }
        });
    };

    /**
     * Return the child config
     *
     * @returns {*}
     */
    ChildBlock.prototype.getChildConfig = function () {
        return Config.getContentTypeConfig(this.field.child_block_type);
    };

    /**
     * Return the elements ID
     *
     * @returns {string}
     */
    ChildBlock.prototype.getId = function () {
        return 'gene-bluefoot' + this.field.code;
    };

    return ChildBlock;
});